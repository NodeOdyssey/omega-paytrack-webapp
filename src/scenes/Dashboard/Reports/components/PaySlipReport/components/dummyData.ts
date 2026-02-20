// adjust path if needed

import { PayslipData } from './PaySlipTemplate';

export const mockPayslipApi: PayslipData = {
  month: 'January',
  year: 2024,
  postName: 'Assam Enterprise LLP',
  postId: 101,

  payslips: [
    {
      employeeProfile: {
        name: 'Nita Dey',
        id: 'A031',
        company: 'Assam Enterprise LLP',
        designation: 'Female Security Guard',
        doj: '01/02/2019',

        bankName: 'SBI',
        accountNumber: '1234567890123456',
        esiNumber: '1234567890',
        uanNumber: '123456789012',
      },

      attendance: {
        totalDays: 30,
        paidDays: 30,
        lwp: 0,
      },

      earnings: {
        basic: 12000,
        hra: 5000,
        conveyance: 600,
        cityAllowance: 0,
        kitWashing: 0,
        specialAllowance: 0,
        otWages: 0,
        uniform: 0,
        vda: 0,
        others: 0,
        total: 17600,
      },

      deductions: {
        epf: 2000,
        esi: 0,
        professionalTax: 0,
        belt: 0,
        boot: 0,
        uniform: 0,
        advance: 0,
        incomeTax: 0,
        others: 0,
        total: 2000,
      },
    },

    {
      employeeProfile: {
        name: 'Rahul Sharma',
        id: 'A032',
        company: 'Assam Enterprise LLP',
        designation: 'Security Guard',
        doj: '15/06/2020',

        bankName: 'HDFC',
        accountNumber: '9876543210123456',
        esiNumber: '2233445566',
        uanNumber: '998877665544',
      },

      attendance: {
        totalDays: 30,
        paidDays: 28,
        lwp: 2,
      },

      earnings: {
        basic: 13000,
        hra: 4000,
        conveyance: 800,
        cityAllowance: 500,
        kitWashing: 200,
        specialAllowance: 0,
        otWages: 1000,
        uniform: 300,
        vda: 0,
        others: 0,
        total: 19800,
      },

      deductions: {
        epf: 2200,
        esi: 300,
        professionalTax: 200,
        belt: 0,
        boot: 0,
        uniform: 0,
        advance: 1000,
        incomeTax: 0,
        others: 0,
        total: 3700,
      },
    },

    {
      employeeProfile: {
        name: 'Anjali Bora',
        id: 'A033',
        company: 'Assam Enterprise LLP',
        designation: 'Supervisor',
        doj: '12/09/2018',

        bankName: 'Axis Bank',
        accountNumber: '4567891234567890',
        esiNumber: '5544332211',
        uanNumber: '112233445566',
      },

      attendance: {
        totalDays: 30,
        paidDays: 30,
        lwp: 0,
      },

      earnings: {
        basic: 18000,
        hra: 7000,
        conveyance: 1200,
        cityAllowance: 1000,
        kitWashing: 0,
        specialAllowance: 2000,
        otWages: 0,
        uniform: 0,
        vda: 0,
        others: 500,
        total: 29700,
      },

      deductions: {
        epf: 3000,
        esi: 500,
        professionalTax: 200,
        belt: 0,
        boot: 0,
        uniform: 0,
        advance: 0,
        incomeTax: 1500,
        others: 0,
        total: 5200,
      },
    },

    {
      employeeProfile: {
        name: 'Suman Das',
        id: 'A034',
        company: 'Assam Enterprise LLP',
        designation: 'Security Guard',
        doj: '05/01/2021',

        bankName: 'PNB',
        accountNumber: '1111222233334444',
        esiNumber: '6677889900',
        uanNumber: '445566778899',
      },

      attendance: {
        totalDays: 30,
        paidDays: 27,
        lwp: 3,
      },

      earnings: {
        basic: 11000,
        hra: 4000,
        conveyance: 600,
        cityAllowance: 0,
        kitWashing: 200,
        specialAllowance: 0,
        otWages: 500,
        uniform: 0,
        vda: 0,
        others: 0,
        total: 16300,
      },

      deductions: {
        epf: 1800,
        esi: 200,
        professionalTax: 200,
        belt: 0,
        boot: 0,
        uniform: 0,
        advance: 500,
        incomeTax: 0,
        others: 0,
        total: 2700,
      },
    },

    {
      employeeProfile: {
        name: 'Priya Sen',
        id: 'A035',
        company: 'Assam Enterprise LLP',
        designation: 'Security Guard',
        doj: '10/03/2022',

        bankName: 'SBI',
        accountNumber: '5555666677778888',
        esiNumber: '8899001122',
        uanNumber: '334455667788',
      },

      attendance: {
        totalDays: 30,
        paidDays: 30,
        lwp: 0,
      },

      earnings: {
        basic: 12500,
        hra: 4500,
        conveyance: 700,
        cityAllowance: 300,
        kitWashing: 0,
        specialAllowance: 0,
        otWages: 0,
        uniform: 0,
        vda: 0,
        others: 0,
        total: 18000,
      },

      deductions: {
        epf: 2100,
        esi: 250,
        professionalTax: 200,
        belt: 0,
        boot: 0,
        uniform: 0,
        advance: 0,
        incomeTax: 0,
        others: 0,
        total: 2550,
      },
    },
  ],
};
