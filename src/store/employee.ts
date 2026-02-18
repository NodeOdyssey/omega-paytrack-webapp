import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { api } from '../configs/api';
import {
  Employee,
  EmployeeTable,
  EmployeeDocuments,
  EmployeeSchedule,
} from '../types/employee';

// --- Types for Store State and Actions ---

type EmployeeStoreState = {
  employees: EmployeeTable[];
  employee: EmployeeTable | null;
  employeeDocs: EmployeeDocuments | null;
  schedules: EmployeeSchedule[];
  isLoading: boolean;
  error: string | null;
  employeeProfilePhoto: string | null;
  pscplLogo: string | null;
  pscplLogoBig: string | null;
  pscplDirectorSign: string | null;
  qrCode: string | null;
};

type EmployeeStoreActions = {
  fetchAllEmployees: (accessToken: string) => Promise<void>;
  fetchEmployeeById: (id: number, accessToken: string) => Promise<void>;
  generateIdCard: (id: number, accessToken: string) => Promise<void>;
  addEmployee: (
    data: Employee,
    accessToken: string
  ) => Promise<EmployeeTable | null>;
  updateEmployee: (
    id: number,
    data: Partial<Employee>,
    accessToken: string
  ) => Promise<EmployeeTable | null>;
  deleteEmployee: (id: number, accessToken: string) => Promise<boolean>;
  uploadEmployeeDocs: (
    id: number,
    docs: EmployeeDocuments,
    accessToken: string
  ) => Promise<void>;
  fetchEmployeeSchedule: (id: number, accessToken: string) => Promise<void>;
  scheduleEmployee: (
    empTableId: number,
    postRankLinkId: number,
    dateOfPosting: string,
    accessToken: string
  ) => Promise<void>;
  transferEmployee: (
    empTableId: number,
    postRankLinkId: number,
    dateOfPosting: Date,
    accessToken: string
  ) => Promise<void>;
  dischargeEmployee: (
    empTableId: number,
    postRankLinkId: number,
    dischargeDate: Date,
    accessToken: string
  ) => Promise<void>;
  clearError: () => void;
};

type EmployeeStore = EmployeeStoreState & EmployeeStoreActions;

// --- Zustand Store Implementation ---

export const useEmployeeStore = create<EmployeeStore>()(
  devtools(
    persist(
      (set) => ({
        employees: [],
        employee: null,
        employeeDocs: null,
        schedules: [],
        isLoading: false,
        error: null,
        employeeProfilePhoto: null,
        pscplLogo: null,
        pscplLogoBig: null,
        pscplDirectorSign: null,
        qrCode: null,

        // Fetch all employees
        fetchAllEmployees: async (accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get<{ employees: EmployeeTable[] }>(
              `${api.baseUrl}${api.employees}`,
              { headers: { 'x-access-token': accessToken } }
            );
            set({ employees: response.data.employees });
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to fetch employees');
          } finally {
            set({ isLoading: false });
          }
        },

        // Fetch single employee by ID
        fetchEmployeeById: async (id, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get<{
              profile: null;
              employee: EmployeeTable;
            }>(`${api.baseUrl}${api.employees}/${id}`, {
              headers: { 'x-access-token': accessToken },
            });
            console.log('response employee: ', response.data);
            set({
              employee: response.data.employee,
              employeeProfilePhoto: response.data.profile || null,
            });
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to fetch employee');
          } finally {
            set({ isLoading: false });
          }
        },

        // Generate employee ID card
        generateIdCard: async (id, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get<{
              qrCode: null;
              pscplDirectorSign: null;
              pscplLogo: null;
              pscplLogoBig: null;
              profile: null;
              employee: EmployeeTable;
            }>(`${api.baseUrl}${api.employees}/generate-id-card/${id}`, {
              headers: { 'x-access-token': accessToken },
            });
            console.log('response employee: ', response.data);
            set({
              employee: response.data.employee,
              employeeProfilePhoto: response.data.profile || null,
              pscplLogo: response.data.pscplLogo || null,
              pscplLogoBig: response.data.pscplLogoBig || null,
              pscplDirectorSign: response.data.pscplDirectorSign || null,
              qrCode: response.data.qrCode || null,
            });
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to fetch employee');
          } finally {
            set({ isLoading: false });
          }
        },

        // Add new employee
        addEmployee: async (data, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.post<{ employee: EmployeeTable }>(
              `${api.baseUrl}/employees`,
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': accessToken,
                },
              }
            );
            set((state) => ({
              employees: [...state.employees, response.data.employee],
            }));
            toast.success('Employee added successfully');
            return response.data.employee;
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to add employee');
            return null;
          } finally {
            set({ isLoading: false });
          }
        },

        // Update employee
        updateEmployee: async (id, data, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.patch<{ employee: EmployeeTable }>(
              `${api.baseUrl}/employees/${id}`,
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': accessToken,
                },
              }
            );
            set((state) => ({
              employees: state.employees.map((emp) =>
                emp.ID === id ? response.data.employee : emp
              ),
              employee: response.data.employee,
            }));
            toast.success('Employee updated successfully');
            return response.data.employee;
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to update employee');
            return null;
          } finally {
            set({ isLoading: false });
          }
        },

        // Delete employee
        deleteEmployee: async (id, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            await axios.delete(`${api.baseUrl}${api.employees}/${id}`, {
              headers: { 'x-access-token': accessToken },
            });
            set((state) => ({
              employees: state.employees.filter((emp) => emp.ID !== id),
            }));
            toast.success('Employee deleted successfully');
            return true;
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to delete employee');
            return false;
          } finally {
            set({ isLoading: false });
          }
        },

        // Upload employee documents
        uploadEmployeeDocs: async (id, docs, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const formData = new FormData();
            Object.entries(docs).forEach(([key, value]) => {
              if (value) formData.append(key, value as Blob);
            });
            await axios.post(
              `${api.baseUrl}/employees/${id}/upload`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'x-access-token': accessToken,
                },
              }
            );
            toast.success('Documents uploaded successfully');
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to upload documents');
          } finally {
            set({ isLoading: false });
          }
        },

        // Fetch employee schedule
        fetchEmployeeSchedule: async (id, accessToken) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get<{ empPostRank: EmployeeSchedule }>(
              `${api.baseUrl}/empPostRankLink/${id}`,
              { headers: { 'x-access-token': accessToken } }
            );
            set({ schedules: [response.data.empPostRank] });
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to fetch schedule');
          } finally {
            set({ isLoading: false });
          }
        },

        // Schedule employee (link post/rank)
        scheduleEmployee: async (
          empTableId,
          postRankLinkId,
          dateOfPosting,
          accessToken
        ) => {
          set({ isLoading: true, error: null });
          try {
            await axios.post(
              `${api.baseUrl}/emp/${empTableId}/link-postrank/${postRankLinkId}`,
              {
                postRankLinkId,
                empTableId,
                dateOfPosting,
              },
              { headers: { 'x-access-token': accessToken } }
            );
            toast.success('Employee scheduled successfully');
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to schedule employee');
          } finally {
            set({ isLoading: false });
          }
        },

        // Transfer employee
        transferEmployee: async (
          empTableId,
          postRankLinkId,
          dateOfPosting,
          accessToken
        ) => {
          set({ isLoading: true, error: null });
          try {
            await axios.patch(
              `${api.baseUrl}/emp/${empTableId}/transfer/${postRankLinkId}`,
              { dateOfPosting },
              { headers: { 'x-access-token': accessToken } }
            );
            toast.success('Employee transferred successfully');
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to transfer employee');
          } finally {
            set({ isLoading: false });
          }
        },

        // Discharge employee
        dischargeEmployee: async (
          empTableId,
          postRankLinkId,
          dischargeDate,
          accessToken
        ) => {
          set({ isLoading: true, error: null });
          try {
            await axios.delete(
              `${api.baseUrl}/emp/${empTableId}/unlink-postrank/${postRankLinkId}/${dischargeDate.toISOString()}`,
              { headers: { 'x-access-token': accessToken } }
            );
            toast.success('Employee discharged successfully');
          } catch (error) {
            set({ error: (error as AxiosError).message });
            toast.error('Failed to discharge employee');
          } finally {
            set({ isLoading: false });
          }
        },

        // Clear error
        clearError: () => set({ error: null }),
      }),
      {
        name: 'employee-store',
        partialize: (state) => ({
          employees: state.employees,
          employee: state.employee,
          schedules: state.schedules,
          employeeProfilePhoto: state.employeeProfilePhoto,
        }),
      }
    )
  )
);

export default useEmployeeStore;
