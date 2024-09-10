import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { useAuth } from "@/components/authprovider"; // Import the authentication context
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const ProfileCard = () => {
  const { user } = useAuth(); // Get the logged-in user from context
  const [userInfo, setUserInfo] = useState<{ fullName?: string; email: string }>({ email: user?.email || "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, "qWE5sgjt0RRhtHDqwciu"); // Use your Firebase user ID
      const sellerDataCollection = collection(userDoc, "seller_data");
      const sellerDataDoc = doc(sellerDataCollection, "Aa8DJ0GHYuhpI1Tt861e");

      const sellerDataSnapshot = await getDoc(sellerDataDoc);

      if (sellerDataSnapshot.exists()) {
        const sellerData = sellerDataSnapshot.data();
        const fullName = sellerData?.seller_info?.fullName || "";
        setUserInfo({ fullName, email: user?.email || "" });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const handleDialogOpen = () => {
    setFullName(userInfo.fullName || ""); // Prefill the full name if available
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, "qWE5sgjt0RRhtHDqwciu");
      const sellerDataCollection = collection(userDoc, "seller_data");
      const sellerDataDoc = doc(sellerDataCollection, "Aa8DJ0GHYuhpI1Tt861e");

      await updateDoc(sellerDataDoc, {
        seller_info: { fullName, email: user?.email },
      });

      setUserInfo((prev) => ({ ...prev, fullName }));
      handleDialogClose();
    } catch (err) {
      console.error("Error saving user info:", err);
    }
  };

  return (
    <>
      <div onClick={handleDialogOpen} className="flex items-center p-5 h-[60px] w-auto rounded-md border border-slate-400 hover:bg-sky-50 hover:-translate-x-1 cursor-pointer">
        <img
          src="https://res.cloudinary.com/dezvucnpl/image/upload/v1711303384/two-removebg-preview_ttc7ev.png"
          alt="Profile"
          width={40}
          height={40}
        />
        <span className="ml-2">{userInfo.fullName || userInfo.email}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-auto"
        >
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>

      {/* Dialog Box */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileCard;
