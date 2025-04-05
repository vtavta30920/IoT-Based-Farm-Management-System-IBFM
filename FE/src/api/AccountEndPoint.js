import {useQuery} from '@tanstack/react-query'
import axios from 'axios';

const fetchGetAllAccount = async (pageIndex, pageSize) => {
  const { data } = await axios.get(`https://localhost:7067/api/v1/account/get-all?pageSize=${pageSize}&pageIndex=${pageIndex}`);
  return data;
};

export const useGetAllAccount = (pageIndex, pageSize) => {
  return useQuery(['v1/account/get-all', pageIndex, pageSize], () => fetchGetAllAccount(pageIndex, pageSize), {
  });
};
