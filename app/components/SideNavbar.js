'use client'

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const SideNavbar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        setAdminName(decoded.username);
        setIsAdmin(userRole === 'admin');

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get/${decoded.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setAvatarSrc(data.response.foto || null);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    checkAdminRole();
  }, []);

  return (
    <div className="h-screen fixed top-20 pb-24 w-64 bg-white text-gray-700 flex flex-col items-center py-10 rounded-r-3xl border border-gray-300 shadow-xl">
      <Avatar
        alt={adminName}
        src={avatarSrc}
        sx={{ width: 80, height: 80 }}
        className="mb-6"
      >
        {!avatarSrc && adminName[0]}
      </Avatar>
      <div className="mb-6 text-lg font-bold">{adminName}</div>
      <div className="mb-6"></div>
      <div className='w-full px-8'>
        <Button
          startIcon={<HomeIcon />}
          onClick={() => router.push('/dashboard')}
          className="mb-4 pr-20 text-sm hover:shadow-lg"
          sx={{
            color: 'grey',
            justifyContent: 'start',
            '&:hover': {
              backgroundColor: '#B22824',
              color: 'white',
            },
          }}
        >
          Beranda
        </Button>
      </div>
      {isAdmin && (
        <>
          <div className='w-full px-8'>
            <Button
              startIcon={<PersonAddIcon />}
              onClick={() => router.push('/dashboard/registermember')}
              className="mb-4 pr-7 text-sm text-nowrap hover:shadow-lg"
              sx={{
                color: 'grey',
                justifyContent: 'start',
                '&:hover': {
                  backgroundColor: '#B22824',
                  color: 'white',
                },
              }}
            >
              Register Akun
            </Button>
          </div>
          <div className='w-full px-8'>
            <Button
              startIcon={<HistoryIcon />}
              onClick={() => router.push('/dashboard/riwayatmasukkan')}
              className="mb-4 text-sm max-w-64 hover:shadow-lg"
              sx={{
                color: 'grey',
                justifyContent: 'start',
                '&:hover': {
                  backgroundColor: '#B22824',
                  color: 'white',
                },
              }}
            >
              Riwayat Masukkan
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideNavbar;
