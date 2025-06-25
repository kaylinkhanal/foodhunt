
'use client'
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

const UserApprovalCard = () => {
    const [kycs, setKycs] = useState([])
    const fetchKycs = async()=>{
        const {data} = await axios.get(process.env.NEXT_PUBLIC_API_URL+'/kycs?status=pending')
        setKycs(data)
    }
    useEffect(()=>{
        fetchKycs()
    },[])

    const handleApproval = async(id) =>{
        const {data} = await axios.patch(process.env.NEXT_PUBLIC_API_URL+ '/kycs/'+ id)
        if(data)   fetchKycs()
    }

  return (
    <div>
        Approve sellers
    {kycs.length > 0 ? kycs.map((item)=>{
            return (
                <Card key={item._id} className="dashboard-card-hover border-1 m-2 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="p-4">
    
                        <h2 className="text-lg font-semibold">{item.seller.name}</h2>
                        <p className="text-sm text-gray-600">{item.seller.email}</p>
                        <p className="text-sm text-gray-600">{item.seller.phoneNumber}</p>
                        <p className="text-sm text-gray-600">{item.seller.location}</p>

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
