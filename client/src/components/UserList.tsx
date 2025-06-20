import type { User } from "../types";

interface UserListProps {
  users: User[];
  onSelect: (user: User) => void;
}

export default function UserList({ users, onSelect }: UserListProps) {
  return (
    <div>
      <h2>Utilisateurs</h2>
      <ul>
        {users.map(u => (
          <li key={u.id} onClick={() => onSelect(u)} style={{ cursor: "pointer" }}>
            {u.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
