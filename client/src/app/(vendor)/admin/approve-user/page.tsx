
'use client'
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

const UserApprovalCard = () => {
    const [user, setUser] = useState([])
    const fetchUser = async()=>{
        const {data} = await axios.get('http://localhost:8080/users?role=seller')
        setUser(data)
    }
    useEffect(()=>{
        fetchUser()
    },[])

    const handleApproval = async(id) =>{
        const {data} = await axios.patch(process.env.NEXT_PUBLIC_API_URL+ '/users/'+ id)
        if(data)   fetchUser()
    }

  return (
    <div>
        Approve sellers
    {user.length > 0 ? user.map((item)=>{
            return (
                <Card key={item._id} className="dashboard-card-hover border-1 m-2 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-sm text-gray-600">{item.email}</p>
                        <p className="text-sm text-gray-600">{item.phoneNumber}</p>
                        <p className="text-sm text-gray-600">{item.location}</p>

                        <Button onClick={()=> handleApproval(item._id)}>Approve</Button>
                        <Button>Reject</Button>
                    </div>
                </Card>
            )
        }) : "No users to approve"}

    </div>

  );
};

export default UserApprovalCard;
