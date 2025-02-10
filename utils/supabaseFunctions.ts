import { supabase } from "./supabase";

export const getAllUsers = async () => {
  const users = await supabase.from("Users").select("id, name");
  return users.data;
};

export const getAllChats = async () => {
  const chats = await supabase.from("Chats").select("*");
  return chats.data;
};

export const addChat = async (user: Number, content: string) => {
  await supabase.from("Chats").insert({ user: user, content: content });
};

// export const deleteChat = async (id: number) => {
//   await supabase.from("Chats").delete().eq("id", id);
// };
