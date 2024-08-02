'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Modal, Box, Typography, Button, Stack, TextField } from '@mui/material';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  
  // Fetch inventory data from Firestore
  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      
      const inventoryList = [];
      docs.forEach((doc) => {
        const data = doc.data();
        if (data.quantity && typeof data.quantity === 'number' && data.quantity > 0) {
          inventoryList.push({
            name: doc.id,
            quantity: data.quantity,
          });
        }
      });

      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Add or update an item in the inventory
  const addItem = async () => {
    if (!itemName) {
      console.warn('Item name is required');
      return;
    }

    try {
      const docRef = doc(collection(firestore, 'inventory'), itemName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: (quantity || 0) + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      
      await updateInventory();
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Remove an item from the inventory
  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else if (quantity > 1) {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }

      await updateInventory();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Increase quantity of an item
  const incrementItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: (quantity || 0) + 1 });
      }
      
      await updateInventory();
    } catch (error) {
      console.error('Error incrementing item:', error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      p={2}
    >
      {/* Modal for adding items */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant="contained" onClick={addItem}>Add Item</Button>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          </Stack>
        </Box>
      </Modal>

      <Typography variant="h1">Inventory Management</Typography>
      <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
      
      {/* Only display inventory table if there are items */}
      {inventory.length > 0 ? (
        <Box
          width="100%"
          maxWidth="800px"
          mt={4}
          p={2}
          border="1px solid #ddd"
          borderRadius={2}
        >
          <Typography variant="h2" mb={2}>Inventory Items</Typography>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr 1fr"
            gap={2}
            borderBottom="1px solid #ddd"
            pb={1}
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">Item</Typography>
            <Typography variant="h6" fontWeight="bold">Quantity</Typography>
            <Typography variant="h6" fontWeight="bold">Actions</Typography>
          </Box>
          {inventory.map((item) => (
            <Box
              key={item.name}
              display="grid"
              gridTemplateColumns="1fr 1fr 1fr 1fr"
              gap={2}
              alignItems="center"
              p={1}
              borderBottom="1px solid #ddd"
            >
              <Typography variant="body1">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
              <Typography variant="body1">{item.quantity}</Typography>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={() => incrementItem(item.name)}
                >
                  Add
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => removeItem(item.name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" mt={2}>No items in inventory</Typography>
      )}
    </Box>
  );
}
