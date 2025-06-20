import React, { useState } from "react";
import type { User } from "../types";

interface UserProfileFormProps {
  onCreate: (user: User) => void;
}

export default function UserProfileForm({ onCreate }: UserProfileFormProps) {
  const [name, setName] = useState("");

}
