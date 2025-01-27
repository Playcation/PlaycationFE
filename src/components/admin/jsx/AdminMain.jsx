// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
//
// const MainPage = () => {
//   const navigate = useNavigate();
//
//   return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//         <Card className="p-6 shadow-xl">
//           <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
//           <CardContent className="space-y-4">
//             <Button
//                 className="w-full"
//                 onClick={() => navigate("/admin/sign-in")}
//             >
//               Create Manager
//             </Button>
//             <Button
//                 className="w-full"
//                 onClick={() => navigate("/admin/tags")}
//             >
//               Create Tag
//             </Button>
//             <Button
//                 className="w-full"
//                 onClick={() => navigate("/admin/users")}
//             >
//               View All Users
//             </Button>
//             <Button
//                 className="w-full"
//                 onClick={() => navigate("/admin/users/:userId/role")}
//             >
//               Update User Role
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//   );
// };
//
// export default MainPage;
