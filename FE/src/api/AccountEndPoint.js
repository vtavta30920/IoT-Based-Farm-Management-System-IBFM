import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//const queryClient = useQueryClient()

// Hàm API get-by-account
const fetchGetAllAccount = async (pageIndex, pageSize) => {
  const { data } = await axios.get(`https://localhost:7067/api/v1/account/get-all?pageSize=${pageSize}&pageIndex=${pageIndex}`);
  return data;
};

export const useGetAllAccount = (pageIndex, pageSize) => {
  return useQuery({
    queryKey: ['v1/account/get-all', { pageIndex, pageSize }],
    queryFn: () => fetchGetAllAccount(pageIndex, pageSize),
  });
};

// Hàm API get-by-email
export const getUserByEmail = async (email) => {
  const response = await axios.get(`https://localhost:7067/api/v1/account/get-by-email?email=${email}`);
  return response.data;
};

// Hook React Query để gọi API get-by-email
export const useGetAccountByEmail = (email) => {
  return useQuery({
    queryKey: ['v1/account/get-by-email', email],
    queryFn: () => getUserByEmail(email), // <-- sửa lại tên hàm cho đúng
    enabled: !!email,
  });
};

// Hàm API để cập nhật trạng thái tài khoản chỉ cần truyền id
export const updateStatus = async (userId) => {
  const response = await axios.put(
    `https://localhost:7067/api/v1/account/update-status/${userId}`
  );
  return response.data;
};

// Hook React Query để gọi API cập nhật trạng thái tài khoản chỉ với id
export const useUpdateStatus = (userId) => {
  return useMutation({
    mutationFn: () => updateStatus(userId), // Chỉ cần truyền id
    onSuccess: (data) => {
      // Xử lý thành công (Ví dụ: thông báo cho người dùng hoặc cập nhật UI)
      console.log('Update status success:', data);
    },
    onError: (error) => {
      // Xử lý lỗi nếu có
      console.error('Update status failed:', error);
    }
  });
};

// Hàm API để cập nhật role tài khoản chỉ cần truyền accountId và roleId
export const updateRole = async (accountId, roleId) => {
  const response = await axios.put(
    `https://localhost:7067/api/v1/account/update-role?accountId=${accountId}&roleId=${roleId}`
  );
  return response.data;
};


// Hook React Query để gọi API cập nhật role chỉ với accountId và roleId
export const useUpdateRole = (accountId, roleId) => {
  return useMutation({
    mutationFn: () => updateRole(accountId, roleId), // Truyền accountId và roleId
    onSuccess: (data) => {
      // Xử lý thành công (Ví dụ: thông báo cho người dùng hoặc cập nhật UI)
      //queryClient.invalidateQueries({queryKey: ["v1/account/get-all"]})
      console.log('Update role success:', data);
    },
    onError: (error) => {
      // Xử lý lỗi nếu có
      console.error('Update role failed:', error);
    }
  });
};

// Hàm API để cập nhật tài khoản
export const updateAccount = async (userId, updateData) => {
  const response = await axios.put(
    `https://localhost:7067/api/v1/account/update/${userId}`,
    updateData // truyền dữ liệu vào đây
  );
  return response.data;
};


// Hook React Query để gọi API cập nhật tài khoản
export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: ({ userId, updateData }) => updateAccount(userId, updateData),
    onSuccess: (data) => {
      console.log('Update account success:', data);
    },
    onError: (error) => {
      console.error('Update account failed:', error);
    },
  });
};

export const createAccount = async (createData) => {
  const response = await axios.post(
    `https://localhost:7067/api/v1/account/create`,
    createData,
    {
      headers: {
        "Content-Type": "application/json", // 👈 thêm dòng này
      },
    }
  );
  return response.data;
};

// Hook React Query để gọi API tạo tài khoản
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: ( createData ) => createAccount(createData),
    onSuccess: (data) => {
      console.log('Create account success:', data);
    },
    onError: (error) => {
      console.error('Create account failed:', error);
    },
  });
};