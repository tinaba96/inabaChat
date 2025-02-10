"use client";

import { useEffect, useState, useRef } from "react";
import { Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addChat, getAllChats, getAllUsers } from "@/utils/supabaseFunctions";

interface User {
  id: number;
  name: string;
}

interface Message {
  id: number;
  content: string;
  user: string;
  created_at: number;
}

export default function Chat() {
  const [chats, setChats] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getChats = async () => {
      const chats = await getAllChats();
      setChats(chats);
    };
    getChats();
  }, []);

  // const scrollRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // メッセージが更新されるたびに最下部にスクロール
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const [selectedUser, setSelectedUser] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "ユーザーを選択してチャットを開始してください",
      user: "system",
      created_at: Date.now(), // Use timestamp instead of Date object
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async (e: any) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedUser) return;

    await addChat(Number(selectedUser), newMessage);

    // const now = Date.now();
    // const userMessage: Message = {
    //   id: messages.length + 1,
    //   content: newMessage,
    //   user: selectedUser,
    //   created_at: now,
    // };

    // const responseMessage: Message = {
    //   id: messages.length + 2,
    //   content: `${selectedUser}さんへの返信：「${newMessage}」についてのお返事です。`,
    //   user: "system",
    //   created_at: now,
    // };

    let chats = await getAllChats();
    setChats(chats);

    // setMessages([...messages, userMessage, responseMessage]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Select onValueChange={setSelectedUser} value={selectedUser}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="ユーザーを選択" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user: User) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-4">
            {chats.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user.toString() === selectedUser?.toString()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.user.toString() === selectedUser?.toString()
                      ? "bg-blue-500 text-white"
                      : message.user === "system"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {message.user !== "system" && (
                    <p className="text-xs font-medium mb-1">
                      {users.find(
                        (user: User) =>
                          user.id.toString() === message.user.toString()
                      )?.name || "Unknown User"}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedUser
                  ? "メッセージを入力..."
                  : "ユーザーを選択してください"
              }
              disabled={!selectedUser}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={!selectedUser || !newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
