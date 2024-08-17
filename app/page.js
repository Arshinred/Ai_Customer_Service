'use client';
import { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hello, I am your AI Nutritionist. How may I be of service today?' }
    ]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false); 

    const handleSendMessage = async () => {
        if (!input.trim() || isSending) return; 

        const userMessage = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsSending(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: input }) 
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let botResponse = '';

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const chunk = decoder.decode(value);
                botResponse += chunk;

                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessageIndex = newMessages.length - 1;
                    if (newMessages[lastMessageIndex]?.role === 'system') {
                        newMessages[lastMessageIndex].content += chunk;
                    } else {
                        newMessages.push({ role: 'system', content: chunk });
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'system', content: 'There was an error processing your request. Please try again.' }
            ]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 3 }}>
            <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                            bgcolor: message.role === 'user' ? 'lightblue' : 'lightgray',
                            p: 2,
                            borderRadius: 2,
                            maxWidth: '80%',
                            wordBreak: 'break-word'
                        }}
                    >
                        {message.content}
                    </Box>
                ))}
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <Button variant="contained" onClick={handleSendMessage} disabled={isSending}>
                    Send
                </Button>
            </Stack>
        </Box>
    );
}
