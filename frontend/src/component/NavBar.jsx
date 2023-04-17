// import React from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
// import Toast from './ToastNotif';

// export default function Nav ({ isLoggedIn, handleLogout, fetchError, errorMsg }) {
//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" style={{ flexGrow: 1 }}>
//             My App
//           </Typography>
//           {isLoggedIn
//             ? (
//             <>
//               <Button color="inherit" component={Link} to="/home">
//                 Home
//               </Button>
//               <Button color="inherit" component={Link} to="/profile">
//                 Profile
//               </Button>
//               <Button color="inherit" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button color="inherit" component={Link} to="/login">
//                 Login
//               </Button>
//               <Button color="inherit" component={Link} to="/register">
//                 Register
//               </Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//       {fetchError && <Toast message={errorMsg} />}
//     </>
//   );
// }
