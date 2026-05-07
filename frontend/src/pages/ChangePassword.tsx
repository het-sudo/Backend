import { useState } from "react";
import API from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  const change = async () => {
    await API.post(
      "/auth/change_password",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      },
    );

    alert("Password changed successfully");
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-center">WELCOME TO USER DASHBOARD</h1>
      <input
        placeholder="Old Password"
        onChange={(e) => setOld(e.target.value)}
        className="border p-2"
      />

      <input
        placeholder="New Password"
        onChange={(e) => setNew(e.target.value)}
        className="border p-2"
      />

      <button onClick={change} className="bg-black text-white p-2">
        Change Password
      </button>
    </div>
  );
}

export default ChangePassword;
