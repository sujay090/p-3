import { Link } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Header = () => {
  const { data: session } = useSession();
  const handleSingOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <button onClick={handleSingOut}>Signout</button>
      {session ? (
        <div>Welcome</div>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Header;
