

import axios from "axios";
import { Card } from "./ui/card";

const UserApprovalCard = async() => {
  const {data} = await axios.get('http://localhost:8080/users?role=seller')
  
  return (
    <Card className="dashboard-card-hover border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
     {JSON.stringify(data)}
    </Card>
  );
};

export default UserApprovalCard;
