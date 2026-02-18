import { create } from 'zustand';
import { toast } from 'react-toastify';
import axios from 'axios';

// Types
import {
  DsReportRow,
  WithoutAllowanceRow,
  NewPayrollRow,
  DSLReportRow,
  LNTRow,
  OthersReportRow,
  ESIRow,
  EPFRow,
  PTaxRow,
  SalaryRow,
} from '../types/report-new';

import { api } from '../configs/api';

type ReportStore = {
  // Loading state
  isLoading: boolean;

  // ViewDS Report
  dsReportData: DsReportRow[];
  doesDsReportExist: boolean;
  dsReportTotalGrossPay: number;
  dsReportTotalNetPay: number;
  // Store current parameters to prevent duplicate API calls
  currentDsReportParams: {
    postId: number;
    month: number;
    year: number;
  } | null;

  fetchDsReportData: (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  // Clear DS report data and parameters
  clearDsReportData: () => void;

  // Without Allowance Report
  withoutAllowanceReportData: WithoutAllowanceRow[];
  doesWithoutAllowanceReportExist: boolean;
  withoutAllowanceTotalBasicSalary: number;
  withoutAllowanceTotalNetPay: number;
  currentWithoutAllowanceParams: {
    postId: number;
    month: number;
    year: number;
  } | null;

  fetchWithoutAllowanceReportData: (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  clearWithoutAllowanceReportData: () => void;

  // New Payroll Report
  newPayrollReportData: NewPayrollRow[];
  doesNewPayrollReportExist: boolean;
  newPayrollTotalBasicSalary: number;
  newPayrollTotalNetPay: number;
  currentNewPayrollParams: {
    postId: number;
    month: number;
    year: number;
  } | null;

  fetchNewPayrollReportData: (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  clearNewPayrollReportData: () => void;

  // DSL Report
  dslReportData: DSLReportRow[];
  doesDslReportExist: boolean;
  dslReportTotalGrossPay: number;
  dslReportTotalNetPay: number;
  currentDslReportParams: {
    postId: number;
    month: number;
    year: number;
  } | null;

  fetchDslReportData: (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  clearDslReportData: () => void;

  // LNT Report
  lntReportData: LNTRow[];
  doesLntReportExist: boolean;
  lntReportTotalAllowance: number;
  lntReportTotalNetPay: number;
  currentLntReportParams: {
    postId: number;
    month: number;
    year: number;
  } | null;

  fetchLntReportData: (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  clearLntReportData: () => void;

  // Others Report
  othersReportData: OthersReportRow[];
  doesOthersReportExist: boolean;
  othersReportTotalGrossPay: number;
  othersReportTotalNetPay: number;
  currentOthersReportParams: {
    postId: number;
    month: number;
    year: number;
  } | null;

  fetchOthersReportData: (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  clearOthersReportData: () => void;

  // EPF Report
  epfReportData: EPFRow[];
  doesEpfReportExist: boolean;
  epfTotalBasicSalary: number;
  epfGrandTotal: number;
  currentEpfReportParams: {
    postIds: number[];
    month: number;
    year: number;
  } | null;

  fetchEpfReportData: (
    postIds: number[],
    selectedDate: Date | null
  ) => Promise<void>;

  clearEpfReportData: () => void;

  // ESI Report
  esiReportData: ESIRow[];
  doesEsiReportExist: boolean;
  esiTotalGrossPay: number;
  esiGrandTotal: number;
  currentEsiReportParams: {
    postIds: number[];
    month: number;
    year: number;
  } | null;

  fetchEsiReportData: (
    postIds: number[],
    // selectedPostName: string | null,
    selectedDate: Date | null
  ) => Promise<void>;

  clearEsiReportData: () => void;

  // PTax Report
  ptaxReportData: PTaxRow[];
  doesPtaxReportExist: boolean;
  ptaxTotalBasicSalary: number;
  ptaxGrandTotal: number;
  currentPtaxReportParams: {
    postIds: number[];
    month: number;
    year: number;
  } | null;

  fetchPtaxReportData: (
    postIds: number[],
    selectedDate: Date | null
  ) => Promise<void>;

  clearPtaxReportData: () => void;

  // Salary Report
  salaryReportData: SalaryRow[];
  doesSalaryReportExist: boolean;
  salaryTotalNetPay: number;
  salaryGrandTotalEpf: number;
  currentSalaryReportParams: {
    postIds: number[];
    month: number;
    year: number;
  } | null;

  fetchSalaryReportData: (
    postIds: number[],
    selectedDate: Date | null
  ) => Promise<void>;

  clearSalaryReportData: () => void;

  // Clear all report data and parameters
  clearAllReportData: () => void;
};

export const useReportStore = create<ReportStore>((set) => ({
  /**
   * Stores the view ds report data
   */
  dsReportData: [],
  doesDsReportExist: false,
  isLoading: false,
  dsReportTotalGrossPay: 0,
  dsReportTotalNetPay: 0,
  currentDsReportParams: null,

  /**
   * Fetches the view ds report data for the selected post and date
   * @param {number} currentSelectedPostId - The ID of the selected post
   * @param {string | null} selectedPostName - The name of the selected post
   * @param {Date | null} selectedDate - The selected date
   * @returns {Promise<void>}
   */

  fetchDsReportData: async (
    // accessToken,
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ): Promise<void> => {
    console.log('fetchDsReportData called');
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken: ', accessToken);
    if (!accessToken || !selectedPostName || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.dsReportData.length > 0 &&
      currentState.doesDsReportExist &&
      currentState.currentDsReportParams?.postId === currentSelectedPostId &&
      currentState.currentDsReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentDsReportParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'DS Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    console.log('Reached after');
    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${api.baseUrl}${api.reports}/ds/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      console.log('Response from ds fetch data: ', response);
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        console.log('Reports:', response.data);
        set({
          doesDsReportExist: true,
          dsReportData: response.data.dsReports,
          dsReportTotalGrossPay: Number(response.data.totalGrossPay),
          dsReportTotalNetPay: Number(response.data.totalNetPay),
          currentDsReportParams: {
            postId: currentSelectedPostId,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesDsReportExist: false });
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      set({ doesDsReportExist: false });
      // handleError(error); // handle error in component or add here if needed
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear DS report data and parameters
  clearDsReportData: () => {
    set({
      dsReportData: [],
      doesDsReportExist: false,
      dsReportTotalGrossPay: 0,
      dsReportTotalNetPay: 0,
      currentDsReportParams: null,
    });
  },

  /**
   * Stores the without allowance report data
   */
  withoutAllowanceReportData: [],
  doesWithoutAllowanceReportExist: false,
  withoutAllowanceTotalBasicSalary: 0,
  withoutAllowanceTotalNetPay: 0,
  currentWithoutAllowanceParams: null,

  /**
   * Fetches the without allowance report data for the selected post and date
   * @param {number} currentSelectedPostId - The ID of the selected post
   * @param {string | null} selectedPostName - The name of the selected post
   * @param {Date | null} selectedDate - The selected date
   * @returns {Promise<void>}
   */
  fetchWithoutAllowanceReportData: async (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !selectedPostName || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.withoutAllowanceReportData.length > 0 &&
      currentState.doesWithoutAllowanceReportExist &&
      currentState.currentWithoutAllowanceParams?.postId ===
        currentSelectedPostId &&
      currentState.currentWithoutAllowanceParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentWithoutAllowanceParams?.year ===
        selectedDate.getFullYear()
    ) {
      console.log(
        'Without Allowance Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${api.baseUrl}/reports/without-allowance/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        set({
          doesWithoutAllowanceReportExist: true,
          withoutAllowanceReportData: response.data.withoutAllowanceReports,
          withoutAllowanceTotalBasicSalary: response.data.totalBasicSalary,
          withoutAllowanceTotalNetPay: response.data.totalNetPay,
          currentWithoutAllowanceParams: {
            postId: currentSelectedPostId,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesWithoutAllowanceReportExist: false });
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      set({ doesWithoutAllowanceReportExist: false });
      // handleError(error); // handle error in component or add here if needed
    } finally {
      set({ isLoading: false });
    }
  },

  clearWithoutAllowanceReportData: () => {
    set({
      withoutAllowanceReportData: [],
      doesWithoutAllowanceReportExist: false,
      withoutAllowanceTotalBasicSalary: 0,
      withoutAllowanceTotalNetPay: 0,
      currentWithoutAllowanceParams: null,
    });
  },

  // New Payroll Report state
  newPayrollReportData: [],
  doesNewPayrollReportExist: false,
  newPayrollTotalBasicSalary: 0,
  newPayrollTotalNetPay: 0,
  currentNewPayrollParams: null,

  fetchNewPayrollReportData: async (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !selectedPostName || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.newPayrollReportData.length > 0 &&
      currentState.doesNewPayrollReportExist &&
      currentState.currentNewPayrollParams?.postId === currentSelectedPostId &&
      currentState.currentNewPayrollParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentNewPayrollParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'New Payroll Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${api.baseUrl}/reports/new-payroll/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        set({
          doesNewPayrollReportExist: true,
          newPayrollReportData: response.data.newPayrollReports,
          newPayrollTotalBasicSalary: Number(response.data.totalBasicSalary),
          newPayrollTotalNetPay: Number(response.data.totalNetPay),
          currentNewPayrollParams: {
            postId: currentSelectedPostId,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesNewPayrollReportExist: false });
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      set({ doesNewPayrollReportExist: false });
      toast.error('Failed to fetch New Payroll Report');
    } finally {
      set({ isLoading: false });
    }
  },

  clearNewPayrollReportData: () => {
    set({
      newPayrollReportData: [],
      doesNewPayrollReportExist: false,
      newPayrollTotalBasicSalary: 0,
      newPayrollTotalNetPay: 0,
      currentNewPayrollParams: null,
    });
  },

  // DSL Report state
  dslReportData: [],
  doesDslReportExist: false,
  dslReportTotalGrossPay: 0,
  dslReportTotalNetPay: 0,
  currentDslReportParams: null,

  fetchDslReportData: async (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !selectedPostName || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.dslReportData.length > 0 &&
      currentState.doesDslReportExist &&
      currentState.currentDslReportParams?.postId === currentSelectedPostId &&
      currentState.currentDslReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentDslReportParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'DSL Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${api.baseUrl}/reports/dsl/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        set({
          doesDslReportExist: true,
          dslReportData: response.data.dslReports,
          dslReportTotalGrossPay: Number(response.data.totalGrossPay),
          dslReportTotalNetPay: Number(response.data.totalNetPay),
          currentDslReportParams: {
            postId: currentSelectedPostId,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesDslReportExist: false });
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      set({ doesDslReportExist: false });
      // Optionally handle error
    } finally {
      set({ isLoading: false });
    }
  },

  clearDslReportData: () => {
    set({
      dslReportData: [],
      doesDslReportExist: false,
      dslReportTotalGrossPay: 0,
      dslReportTotalNetPay: 0,
      currentDslReportParams: null,
    });
  },

  // LNT Report state
  lntReportData: [],
  doesLntReportExist: false,
  lntReportTotalAllowance: 0,
  lntReportTotalNetPay: 0,
  currentLntReportParams: null,

  fetchLntReportData: async (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    if (!accessToken || !selectedPostName || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.lntReportData.length > 0 &&
      currentState.doesLntReportExist &&
      currentState.currentLntReportParams?.postId === currentSelectedPostId &&
      currentState.currentLntReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentLntReportParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'LNT Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${api.baseUrl}${api.reports}/lnt/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        set({
          doesLntReportExist: true,
          lntReportData: response.data.lntReports,
          lntReportTotalAllowance: Number(response.data.totalAllowance),
          lntReportTotalNetPay: Number(response.data.totalNetPay),
          currentLntReportParams: {
            postId: currentSelectedPostId,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesLntReportExist: false });
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      set({ doesLntReportExist: false });
      // Optionally handle error
    } finally {
      set({ isLoading: false });
    }
  },

  clearLntReportData: () => {
    set({
      lntReportData: [],
      doesLntReportExist: false,
      lntReportTotalAllowance: 0,
      lntReportTotalNetPay: 0,
      currentLntReportParams: null,
    });
  },

  // Others Report state
  othersReportData: [],
  doesOthersReportExist: false,
  othersReportTotalGrossPay: 0,
  othersReportTotalNetPay: 0,
  currentOthersReportParams: null,

  fetchOthersReportData: async (
    currentSelectedPostId: number,
    selectedPostName: string | null,
    selectedDate: Date | null
  ) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !selectedPostName || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.othersReportData.length > 0 &&
      currentState.doesOthersReportExist &&
      currentState.currentOthersReportParams?.postId ===
        currentSelectedPostId &&
      currentState.currentOthersReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentOthersReportParams?.year ===
        selectedDate.getFullYear()
    ) {
      console.log(
        'Others Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${api.baseUrl}${api.reports}/other/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        set({
          doesOthersReportExist: true,
          othersReportData: response.data.otherReports,
          othersReportTotalGrossPay: Number(response.data.totalGrossPay),
          othersReportTotalNetPay: Number(response.data.totalNetPay),
          currentOthersReportParams: {
            postId: currentSelectedPostId,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesOthersReportExist: false });
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      set({ doesOthersReportExist: false });
      // Optionally handle error
    } finally {
      set({ isLoading: false });
    }
  },

  clearOthersReportData: () => {
    set({
      othersReportData: [],
      doesOthersReportExist: false,
      othersReportTotalGrossPay: 0,
      othersReportTotalNetPay: 0,
      currentOthersReportParams: null,
    });
  },

  // EPF Report state
  epfReportData: [],
  doesEpfReportExist: false,
  epfTotalBasicSalary: 0,
  epfGrandTotal: 0,
  currentEpfReportParams: null,

  fetchEpfReportData: async (postIds, selectedDate) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    console.log('Post IDs:', postIds);
    if (!postIds.length || !accessToken || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.epfReportData.length > 0 &&
      currentState.doesEpfReportExist &&
      currentState.currentEpfReportParams?.postIds.length === postIds.length &&
      currentState.currentEpfReportParams?.postIds.every((id) =>
        postIds.includes(id)
      ) &&
      currentState.currentEpfReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentEpfReportParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'EPF Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.post(
        `${api.baseUrl}/reports/epf/all`,
        {
          postIds,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
        {
          headers: { 'x-access-token': accessToken },
        }
      );

      if (response.data?.success) {
        set({
          doesEpfReportExist: true,
          epfReportData: response.data.epfReports,
          epfTotalBasicSalary: Number(response.data.totalBasicSalary),
          epfGrandTotal: Number(response.data.grandTotalEpf),
          currentEpfReportParams: {
            postIds,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesEpfReportExist: false });
      }
    } catch (error) {
      set({ doesEpfReportExist: false });
      toast.error('Failed to fetch EPF Report');
    } finally {
      set({ isLoading: false });
    }
  },

  clearEpfReportData: () => {
    set({
      epfReportData: [],
      doesEpfReportExist: false,
      epfTotalBasicSalary: 0,
      epfGrandTotal: 0,
      currentEpfReportParams: null,
    });
  },

  // ESI Report state
  esiReportData: [],
  doesEsiReportExist: false,
  esiTotalGrossPay: 0,
  esiGrandTotal: 0,
  currentEsiReportParams: null,

  fetchEsiReportData: async (postIds, selectedDate) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    if (postIds.length === 0 || !accessToken || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.esiReportData.length > 0 &&
      currentState.doesEsiReportExist &&
      currentState.currentEsiReportParams?.postIds.length === postIds.length &&
      currentState.currentEsiReportParams?.postIds.every((id) =>
        postIds.includes(id)
      ) &&
      currentState.currentEsiReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentEsiReportParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'ESI Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.post(
        `${api.baseUrl}/reports/esi/all`,
        {
          postIds,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
        {
          headers: { 'x-access-token': accessToken },
        }
      );

      console.log('Response from ESI fetch data: ', response);
      if (response.data?.success) {
        set({
          doesEsiReportExist: true,
          esiReportData: response.data.esiReports,
          esiTotalGrossPay: Number(response.data.totalGrossPay),
          esiGrandTotal: Number(response.data.grandTotalEsi),
          currentEsiReportParams: {
            postIds,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesEsiReportExist: false });
      }
    } catch (error) {
      set({ doesEsiReportExist: false });
      toast.error('Failed to fetch ESI Report');
    } finally {
      set({ isLoading: false });
    }
  },

  clearEsiReportData: () => {
    set({
      esiReportData: [],
      doesEsiReportExist: false,
      esiTotalGrossPay: 0,
      esiGrandTotal: 0,
      currentEsiReportParams: null,
    });
  },

  // PTax Report state
  ptaxReportData: [],
  doesPtaxReportExist: false,
  ptaxTotalBasicSalary: 0,
  ptaxGrandTotal: 0,
  currentPtaxReportParams: null,

  fetchPtaxReportData: async (postIds, selectedDate) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    console.log('Post IDs:', postIds);
    console.log('Selected Date:', selectedDate);

    if (!postIds.length || !accessToken || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.ptaxReportData.length > 0 &&
      currentState.doesPtaxReportExist &&
      currentState.currentPtaxReportParams?.postIds.length === postIds.length &&
      currentState.currentPtaxReportParams?.postIds.every((id) =>
        postIds.includes(id)
      ) &&
      currentState.currentPtaxReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentPtaxReportParams?.year === selectedDate.getFullYear()
    ) {
      console.log(
        'PTax Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });
    console.log('Fetching PTax Report data...');
    try {
      const response = await axios.post(
        `${api.baseUrl}/reports/ptax`,
        {
          postIds,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
        {
          headers: { 'x-access-token': accessToken },
        }
      );

      console.log('Response from PTax fetch data: ', response);

      // ...inside fetchPtaxReportData...
      if (response.data?.success) {
        set({
          doesPtaxReportExist: true,
          ptaxReportData: response.data.pTaxReport, // <-- correct
          ptaxTotalBasicSalary: Number(response.data.totalBasicSalary), // <-- correct
          ptaxGrandTotal: Number(response.data.totalPTax), // <-- correct, if only one total
          currentPtaxReportParams: {
            postIds,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesPtaxReportExist: false });
      }
    } catch (error) {
      set({ doesPtaxReportExist: false });
      toast.error('Failed to fetch PTax Report');
    } finally {
      set({ isLoading: false });
    }
  },

  clearPtaxReportData: () => {
    set({
      ptaxReportData: [],
      doesPtaxReportExist: false,
      ptaxTotalBasicSalary: 0,
      ptaxGrandTotal: 0,
      currentPtaxReportParams: null,
    });
  },

  // Salary Report state
  salaryReportData: [],
  doesSalaryReportExist: false,
  salaryTotalNetPay: 0,
  salaryGrandTotalEpf: 0,
  currentSalaryReportParams: null,

  fetchSalaryReportData: async (postIds, selectedDate) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!postIds.length || !accessToken || !selectedDate) return;

    // Check if we already have data for the same parameters to prevent unnecessary calls
    const currentState = useReportStore.getState();
    if (
      currentState.salaryReportData.length > 0 &&
      currentState.doesSalaryReportExist &&
      currentState.currentSalaryReportParams?.postIds.length ===
        postIds.length &&
      currentState.currentSalaryReportParams?.postIds.every((id) =>
        postIds.includes(id)
      ) &&
      currentState.currentSalaryReportParams?.month ===
        selectedDate.getMonth() + 1 &&
      currentState.currentSalaryReportParams?.year ===
        selectedDate.getFullYear()
    ) {
      console.log(
        'Salary Report data already exists for these parameters, skipping fetch'
      );
      return;
    }

    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${api.baseUrl}/reports/salary`,
        {
          postIds,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        set({
          doesSalaryReportExist: true,
          salaryReportData: response.data.salaryReport,
          salaryTotalNetPay: Number(response.data.totalNetPay),
          salaryGrandTotalEpf: Number(response.data.grandTotalEpf),
          currentSalaryReportParams: {
            postIds,
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        });
      } else {
        set({ doesSalaryReportExist: false });
      }
    } catch (error) {
      set({ doesSalaryReportExist: false });
      toast.error('Failed to fetch Salary Report');
    } finally {
      set({ isLoading: false });
    }
  },

  clearSalaryReportData: () => {
    set({
      salaryReportData: [],
      doesSalaryReportExist: false,
      salaryTotalNetPay: 0,
      salaryGrandTotalEpf: 0,
      currentSalaryReportParams: null,
    });
  },

  // Clear all report data and parameters
  clearAllReportData: () => {
    set({
      dsReportData: [],
      doesDsReportExist: false,
      dsReportTotalGrossPay: 0,
      dsReportTotalNetPay: 0,
      currentDsReportParams: null,
      withoutAllowanceReportData: [],
      doesWithoutAllowanceReportExist: false,
      withoutAllowanceTotalBasicSalary: 0,
      withoutAllowanceTotalNetPay: 0,
      currentWithoutAllowanceParams: null,
      newPayrollReportData: [],
      doesNewPayrollReportExist: false,
      newPayrollTotalBasicSalary: 0,
      newPayrollTotalNetPay: 0,
      currentNewPayrollParams: null,
      dslReportData: [],
      doesDslReportExist: false,
      dslReportTotalGrossPay: 0,
      dslReportTotalNetPay: 0,
      currentDslReportParams: null,
      lntReportData: [],
      doesLntReportExist: false,
      lntReportTotalAllowance: 0,
      lntReportTotalNetPay: 0,
      currentLntReportParams: null,
      othersReportData: [],
      doesOthersReportExist: false,
      othersReportTotalGrossPay: 0,
      othersReportTotalNetPay: 0,
      currentOthersReportParams: null,
      epfReportData: [],
      doesEpfReportExist: false,
      epfTotalBasicSalary: 0,
      epfGrandTotal: 0,
      currentEpfReportParams: null,
      esiReportData: [],
      doesEsiReportExist: false,
      esiTotalGrossPay: 0,
      esiGrandTotal: 0,
      currentEsiReportParams: null,
      ptaxReportData: [],
      doesPtaxReportExist: false,
      ptaxTotalBasicSalary: 0,
      ptaxGrandTotal: 0,
      currentPtaxReportParams: null,
      salaryReportData: [],
      doesSalaryReportExist: false,
      salaryTotalNetPay: 0,
      salaryGrandTotalEpf: 0,
      currentSalaryReportParams: null,
    });
  },
}));
