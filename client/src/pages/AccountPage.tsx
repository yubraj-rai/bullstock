import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthState } from '../types';
import { GET_TRANSACTIONS, DEPOSIT, WITHDRAW, CREATE_STRIPE_SESSION, CREATE_STRIPE_ACCOUNT_LINK, VERIFY_PAYMENT } from '../graphql';
import { UPDATE_BALANCE } from '../redux/actions';
import { Tab } from '@headlessui/react';
import { useQuery, useMutation } from '@apollo/client';
import { Transaction } from '../__generated__/graphql';
import Modal from 'react-modal';

import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


Modal.setAppElement('#root'); // Set the app element for react-modal here

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const transferOptions = [500, 1000, 10000];

const AccountPage = ({ refetchUser }: { refetchUser: () => Promise<any> }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: transactionsRaw } = useQuery(GET_TRANSACTIONS);
    const transactions: Transaction[] = useMemo(() => transactionsRaw?.transactions || [], [transactionsRaw]);
    const auth = useSelector((state: AuthState) => state.authReducer.authData);


    //const [depositMutation] = useMutation(DEPOSIT);
    const [withdrawMutation] = useMutation(WITHDRAW);
    const [createStripeSession] = useMutation(CREATE_STRIPE_SESSION);
    const [createStripeAccountLink] = useMutation(CREATE_STRIPE_ACCOUNT_LINK);
    const [verifyMutation] = useMutation(VERIFY_PAYMENT); // Added GraphQL query for verification

    const [errors, setErrors] = useState<string | null>(null);
    const [transferAmount, setTransferAmount] = useState<number>(0);
    const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
    const [isLoadingWithDraw, setIsLoadingWithdraw] = useState(false);
    const [kycStatus, setKycStatus] = useState<'verified' | 'not_verified'>('not_verified');
    
    useEffect(() => {
        if (auth) {
            document.title = auth?.user?.username + ' | Bullstock';
        }
    }, [auth]);

    useEffect(() => {
        if (auth?.user?._id) {
            verifyPayment();
            checkKycStatus();
        }
    }, [auth?.user?._id]);


    const checkKycStatus = async () => {
        try {
            const { data: refetchedData } = await refetchUser();
            if (!refetchedData?.getUser) {
                throw new Error('Failed to refetch user data');
            }

            const isVerified = refetchedData?.getUser?.user?.isKycVerified;
            setKycStatus(isVerified ? 'verified' : 'not_verified');
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('Error checking KYC status:', err.message);
                    setErrors('Failed to check KYC status. Please try again later.');
                } else {
                    console.error('Unknown error checking KYC status:', err);
                    setErrors('An unknown error occurred. Please try again later.');
            }
        }
    };
                

    const handleStripeKYCOnboarding = async () => {
        try {
            // Refetch user data to ensure we have the latest KYC and Stripe account details
            const { data: refetchedData } = await refetchUser();
            if (!refetchedData?.getUser) {
                throw new Error('Failed to refetch user data');
            }
    
            //  console.log('Refetched User Data:', refetchedData?.getUser);
            //  console.log('Updated Stripe Account ID:', refetchedData?.getUser?.user?.stripeAccountId);
            //  console.log('Updated KYC Status:', refetchedData?.getUser?.user?.isKycVerified);
    
            const isKycVerified = refetchedData?.getUser?.user?.isKycVerified;
            const stripeAccountId = refetchedData?.getUser?.user?.stripeAccountId;

            if (!stripeAccountId || !isKycVerified) {
                console.log('User does not have a linked Stripe account. Initiating account creation...');
                const { data } = await createStripeAccountLink({
                    variables: { userId: refetchedData?.getUser?.user?._id },
                });
    
                if (data?.createStripeAccountLink?.success) {
                    console.log(
                        'Stripe account successfully created and redirecting to Stripe onboarding:',
                        data.createStripeAccountLink.stripeAccountId
                    );
                    window.location.href = data.createStripeAccountLink.url; 
                    setKycStatus('verified');
                } else {
                    console.error('Error: Failed to create Stripe account link');
                    throw new Error(data?.createStripeAccountLink?.message || 'Failed to create Stripe account link');
                }
            }

            console.log('KYC already verified.');
        } catch (error) {
            console.error('Validation Error:', error);
            throw error;
        }
    };

    const verifyPayment = async () => {
        try {
            const pendingDepositStr = localStorage.getItem('pendingDeposit');
            if (!pendingDepositStr) return;

            const pendingDeposit = JSON.parse(pendingDepositStr);
            const { sessionId, timestamp } = pendingDeposit;

            // Check if the deposit has expired
            const now = new Date().getTime();
            const depositTime = new Date(timestamp).getTime();


            if (now - depositTime > 60000) { // 1 hour
                console.log('Deposit session expired.');
                localStorage.removeItem('pendingDeposit');
                setErrors('Deposit session expired. Please try again.');
                return;
            }

            // Call the GraphQL mutation to verify payment
            const { data } = await verifyMutation({
                variables: { userId: auth?.user?._id, sessionId },
            });

            
            if (data?.verifyPayment?.success) {
                console.log('Payment verification successful:', data.verifyPayment);
                localStorage.removeItem('pendingDeposit');
                dispatch({
                    type: UPDATE_BALANCE,
                    payload: { newBalance: data.verifyPayment.newBalance },
                });
                navigate('/account');
                setErrors('Deposit successful!');
            } else {
                console.error('Verification failed:', data?.verifyPayment?.message);
                setErrors(data?.verifyPayment?.message || 'Failed to verify payment.');
            }
        } catch (err) {
            console.error('Error verifying payment:', err);
            setErrors('Failed to verify payment status.');
        }
    }
      
    const handleDeposit = async () => {
        if (transferAmount <= 0) {
          setErrors('Amount must be greater than 0');
          return;
        }

        try {
          setErrors(null);
          setIsLoadingDeposit(true);
      
          const { data } = await createStripeSession({
            variables: { amount: transferAmount },
          });
      
          if (data?.createStripeSession?.url) {
            localStorage.setItem(
              'pendingDeposit',
              JSON.stringify({
                amount: transferAmount,
                sessionId: data.createStripeSession.sessionId,
                timestamp: new Date().toISOString(),
              })
            );
            window.location.href = data.createStripeSession.url;
          } else {
            throw new Error('Failed to create Stripe session');
          }
        } catch (err) {
            console.error('Error initiating deposit:', err);
            if (err instanceof Error) {
                setErrors(err.message || 'Failed to process deposit.');
            } else {
                setErrors('Failed to process deposit.');
            }
        } finally {
            setIsLoadingDeposit(false);
        }
    };
      


    const handleWithdraw = async () => {    
        if (transferAmount <= 0) {
            console.error('Error: Transfer amount must be greater than 0');
            setErrors('Amount must be greater than 0');
            return;
        }
    
        if (transferAmount > auth?.user?.balance) {
            console.error('Error: Insufficient balance for withdrawal');
            setErrors('Insufficient balance');
            return;
        }
    
        setErrors(null);
        setIsLoadingWithdraw(true);
    
        // console.log('Initiating withdrawal process...', auth);
        // console.log('Current User Balance:', auth?.user?.balance);
        // console.log('Requested Transfer Amount:', transferAmount);
    
        try {
            console.log('Executing withdrawal mutation...');
            const { data: withdrawData } = await withdrawMutation({
                variables: { amount: transferAmount },
            });
    
            if (withdrawData?.withdraw?.success) {
                console.log('Withdrawal successful. New balance:', withdrawData.withdraw.newBalance);
                dispatch({
                    type: UPDATE_BALANCE,
                    payload: { newBalance: withdrawData.withdraw.newBalance },
                });
                setErrors('Withdrawal successful!');
                setTransferAmount(0); // Reset transfer amount after successful withdrawal
            } else {
                console.error('Error: Withdrawal failed');
                throw new Error(withdrawData?.withdraw?.message || 'Withdrawal failed');
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error processing withdrawal:', err.message);
                setErrors(err.message || 'Failed to process withdrawal');
            } else {
                console.error('Unexpected error processing withdrawal:', err);
                setErrors('Failed to process withdrawal');
            }
        } finally {
            console.log('Withdrawal process completed.');
            setIsLoadingWithdraw(false);
        }
    };
      
    const generatePDF = () => {
        const doc = new jsPDF();
        let y = 10;
    
        // Header Section
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('Transaction Details', doc.internal.pageSize.width / 2, y, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Account Summary', doc.internal.pageSize.width / 2, y + 10, { align: 'center' });
        
        // Add a line separator below the title
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(10, y + 15, doc.internal.pageSize.width - 10, y + 15);
    
        // User Information Section
        y += 25;
        doc.setFontSize(14);
        doc.setTextColor(40);
        // doc.text(`User Email: ${auth?.user?.username}`, 10, y);
        // y += 8;
        doc.text(`Current Balance: ${auth?.user?.balance.toFixed(2)}`, 10, y);
        y += 5;
        doc.line(10, y, doc.internal.pageSize.width - 10, y);
        
        // Table Title Section
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(40);
        
        // Custom Table Data
        const tableColumn = ['Type', 'Ticker', 'Shares', 'Amount', 'Date'];
        const tableRows : any = [];
    
        transactions.forEach((item) => {
            const itemData = [
                item.type,
                item.ticker,
                item.shares?.toString() || '0',
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                }).format(item.totalAmount),
                `${new Date(item.date).toDateString()} - ${new Date(item.date).toLocaleTimeString()}`,
            ];
            tableRows.push(itemData);
        });
    
        // Add Table with autoTable Plugin
        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: y + 10,
            theme: 'striped',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            bodyStyles: {
                halign: 'center',
                fontSize: 10,
                textColor: [80, 80, 80],
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            styles: {
                fontSize: 10,
                cellPadding: 6,
                halign: 'center',
                valign: 'middle',
                lineColor: [44, 62, 80],
                lineWidth: 0.25,
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 'auto' },
            },
        });
    
        // Add Footer with Page Numbering
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
    
        // Save the PDF
        doc.save('transaction_report.pdf');
    };

    return (
      <>
          {auth && (
              <div className='dark:bg-darkBg flex flex-col min-h-screen items-center justify-center overflow-hidden'>
                  <div className='container flex flex-col md:items-center text-gray-900 dark:text-white'>
                      <h1 className='title-font text-center sm:text-2xl text-xl mb-8 font-medium'>My Account</h1>
                      <div className='md:flex justify-center items-start h-full md:w-3/4 md:h-3/4'>
                          <Tab.Group vertical>
                              <Tab.List className='flex md:flex-col space-x-1 space-y-1 mb-5 md:mb-0 md:mt-5 mr-5'>
                                  <Tab
                                      key={'Profile'}
                                      className={({ selected }) =>
                                          classNames(
                                              selected
                                                  ? 'dark:bg-darkField dark:text-white bg-gray-100'
                                                  : 'dark:text-gray-300 dark:hover:bg-darkField dark:hover:text-white hover:bg-gray-100',
                                              'text-black px-5 py-2 text-md text-center rounded-2xl flex items-center'
                                          )
                                      }>
                                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                              strokeWidth='2'
                                              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                          />
                                      </svg>
                                      Account
                                  </Tab>
                                  <Tab
                                      key={'Transactions'}
                                      className={({ selected }) =>
                                          classNames(
                                              selected
                                                  ? 'dark:bg-darkField dark:text-white bg-gray-100'
                                                  : 'dark:text-gray-300 dark:hover:bg-darkField dark:hover:text-white hover:bg-gray-100',
                                              'text-black px-5 py-2 text-md text-center rounded-2xl flex items-center'
                                          )
                                      }>
                                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                              strokeWidth='2'
                                              d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                                          />
                                      </svg>
                                      Transactions
                                  </Tab>
                              </Tab.List>
                              <Tab.Panels className='dark:bg-darkField bg-gray-100 rounded-2xl dark:text-white p-3 w-full' style={{ minHeight: '700px' }}>

                                 <Tab.Panel key={'Profile'} className={classNames('min-h-full')}>
                                    <div className='flex flex-col justify-center p-5 h-full'>
                                        <section className='mx-auto pb-7 w-full flex-1 space-y-6'>

                                            {/* Balance Display */}
                                            <div className='bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb] dark:from-[#1f2937] dark:to-[#111827] p-6 rounded-lg shadow-md'>
                                                <h2 className='text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] mb-3'>
                                                    Balance
                                                </h2>
                                                <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                                                    Current Balance:&nbsp;
                                                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] font-bold'>
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            maximumFractionDigits: 2,
                                                            minimumFractionDigits: 2,
                                                        }).format(auth ? auth?.user?.balance : 0)}
                                                    </span>
                                                </h3>
                                            </div>

                                            {/* Customer KYC */}
                                            <div className='bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb] dark:from-[#1f2937] dark:to-[#111827] p-6 rounded-lg shadow-md'>
                                                <h2 className='text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] mb-3'>
                                                    Customer KYC
                                                </h2>
                                                <div className='flex justify-left'>
                                                    <button
                                                        onClick={kycStatus === 'not_verified' ? handleStripeKYCOnboarding : undefined}
                                                        disabled={kycStatus === 'verified'}
                                                        className={`flex items-center max-h-16 text-white border-0 py-2 px-4 md:px-6 focus:outline-none transition-all rounded-full ${
                                                            kycStatus === 'verified'
                                                                ? 'bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-[#db6b61] to-[#ff8b81] hover:shadow-lg hover:scale-105'
                                                        }`}
                                                    >
                                                        {kycStatus === 'verified' ? 'KYC Verified' : 'Verify KYC'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Amount Selection */}
                                            <div className='bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb] dark:from-[#1f2937] dark:to-[#111827] p-6 rounded-lg shadow-md space-y-6'>
                                                <h2 className='text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] text-left mb-3'>
                                                    Select or Enter an Amount
                                                </h2>

                                                {/* Quick Select Buttons */}
                                                <div className='flex justify-between items-center mb-4'>
                                                    {/* Deposit Amount Buttons (Align with Input Field) */}
                                                    <div className='flex space-x-2 md:space-x-5' >
                                                        {transferOptions.map((option, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => setTransferAmount(Number(option.toFixed(2)))}
                                                                className='flex items-center max-h-16 text-white bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] border-0 py-2 px-4 md:px-6 focus:outline-none hover:shadow-lg hover:scale-105 transition-all rounded-full'>
                                                                {new Intl.NumberFormat('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'USD',
                                                                    maximumFractionDigits: 0,
                                                                    minimumFractionDigits: 0,
                                                                }).format(option)}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Withdraw Amount Button (Right-Aligned) */}
                                                    {auth?.user?.balance > 0 && (
                                                        <div className='flex space-x-2 md:space-x-5'>
                                                            <button
                                                                onClick={() => setTransferAmount(Number(auth?.user?.balance.toFixed(2)))}
                                                                className='flex items-center max-h-16 text-white bg-gradient-to-r from-[#db6b61] to-[#ff8b81] border-0 py-2 px-4 md:px-6 focus:outline-none hover:shadow-lg hover:scale-105 transition-all rounded-full'>
                                                                {new Intl.NumberFormat('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'USD',
                                                                    maximumFractionDigits: 2,
                                                                    minimumFractionDigits: 2,
                                                                }).format(auth?.user?.balance)}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Manual Input Field */}
                                                <div className='relative'>
                                                    <span className='absolute inset-y-0 left-0 flex items-center px-4 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-l-md'>
                                                        $
                                                    </span>
                                                    <input
                                                        required
                                                        id='transferAmount'
                                                        type='number'
                                                        name='transferAmount'
                                                        min={0}
                                                        value={transferAmount}
                                                        onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
                                                        placeholder='e.g., $500, $1000, or custom amount'
                                                        className='block w-full pl-14 py-3 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#219cd7] focus:outline-none shadow-md'
                                                        style={{
                                                            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'2\' stroke=\'%23cbd5e1\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M4 6h16M4 12h16m-7 6h7\' /%3E%3C/svg%3E")',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'right 10px center',
                                                            backgroundSize: '20px',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className='flex space-x-5 pt-5'>
                                                <button
                                                    onClick={handleDeposit}
                                                    disabled={isLoadingWithDraw || isLoadingDeposit}
                                                    className='w-full flex justify-center px-6 py-3 text-white font-semibold bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#219cd7]/50'>
                                                    {isLoadingDeposit && !errors ? 'Processing...' : 'Deposit'}
                                                </button>
                                               {/* Withdraw Button */}
                                                <button
                                                    onClick={handleWithdraw}
                                                    disabled={
                                                        kycStatus === 'not_verified' || // Disable if KYC is not verified
                                                        transferAmount > auth?.user?.balance || 
                                                        isLoadingWithDraw || 
                                                        isLoadingDeposit
                                                    }
                                                    className={classNames(
                                                        kycStatus === 'not_verified'
                                                            ? 'cursor-not-allowed bg-gray-400'
                                                            : transferAmount > auth?.user?.balance
                                                            ? 'cursor-not-allowed bg-gray-400'
                                                            : 'bg-gradient-to-r from-[#db6b61] to-[#ff8b81] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-[#db6b61]/50',
                                                        'w-full flex justify-center px-6 py-3 text-white font-semibold rounded-full focus:outline-none'
                                                    )}
                                                >
                                                    {isLoadingWithDraw && !errors ? 'Processing...' : 'Withdraw'}
                                                </button>

                                              </div>
                                        </section>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel key={'Profile'} className={classNames('min-h-full')}>
                                <div className='flex flex-col justify-center p-5 h-full'>
                                {/* <Tab.Panel key={'Transactions'} className={classNames('h-full overflow-auto')}>
                                  <div className='flex h-full min-w-panel'> */}
                                      <div className='text-xs overflow-auto h-panel w-full'>
                                          <h2 className='text-left text-lg font-semibold text-gray-700 capitalize dark:text-gray-200 mb-2 px-3 pt-2 flex justify-between items-center'>
                                                <span>Transactions - {transactions && transactions.length} latest records</span>
                                                <button 
                                                    className="w-10 transition-all h-10 display: inline-block sm:w-auto sm:h-10 text-sm sm:px-4 sm:py-2 sm:justify-center rounded-full outline-none border-none flex justify-center items-center px-3 py-1 font-medium hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white bg-[#6dbfdd] focus-visible:ring-opacity-75 shadow-md" 
                                                    onClick={generatePDF}>
                                                    Download PDF
                                                </button>
                                            </h2>

                                          {/* Table Wrapper */}
                                          <div className='shadow-lg rounded-lg overflow-hidden'>
                                              <table className='table-auto w-full'>
                                                  {/* Table Header */}
                                                  <thead className='bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] text-white text-xs uppercase font-semibold'>
                                                      <tr>
                                                          <th className='px-5 py-3 text-center'>Type</th>
                                                          <th className='px-5 py-3 text-center'>Ticker</th>
                                                          <th className='px-5 py-3 text-center'>Shares</th>
                                                          <th className='px-5 py-3 text-center'>Amount</th>
                                                          <th className='px-5 py-3 text-center'>Date</th>
                                                      </tr>
                                                  </thead>

                                                  {/* Table Body */}
                                                  <tbody>
                                                      {transactions.map((transaction, i) => (
                                                          <tr
                                                              key={i}
                                                              className='bg-white dark:bg-darkCard hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200'
                                                          >
                                                              <td className='px-5 py-4 border-b border-gray-200 dark:border-gray-800 text-center'>
                                                                  <span
                                                                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                                                          transaction.type === 'SELL'
                                                                              ? 'bg-green-100 text-green-800'
                                                                              : 'bg-red-100 text-red-800'
                                                                      }`}
                                                                  >
                                                                      {transaction.type}
                                                                  </span>
                                                              </td>
                                                              <td className='px-5 py-4 border-b border-gray-200 dark:border-gray-800 text-center'>
                                                                  <p className='text-gray-900 dark:text-white'>{transaction.ticker}</p>
                                                              </td>
                                                              <td className='px-5 py-4 border-b border-gray-200 dark:border-gray-800 text-center'>
                                                                  <p className='text-gray-900 dark:text-white'>
                                                                      {transaction.shares} x{' '}
                                                                      {new Intl.NumberFormat('en-US', {
                                                                          style: 'currency',
                                                                          currency: 'USD',
                                                                          maximumFractionDigits: 2,
                                                                          minimumFractionDigits: 2,
                                                                      }).format(transaction.stockPrice ?? 0)}
                                                                  </p>
                                                              </td>
                                                              <td className='px-5 py-4 border-b border-gray-200 dark:border-gray-800 text-center'>
                                                                  <p
                                                                      className={`rounded-full px-3 py-1 inline-block text-xs ${
                                                                          transaction.type === 'SELL'
                                                                              ? 'bg-green-200 text-green-900'
                                                                              : 'bg-red-200 text-red-900'
                                                                      }`}
                                                                  >
                                                                      {new Intl.NumberFormat('en-US', {
                                                                          style: 'currency',
                                                                          currency: 'USD',
                                                                          maximumFractionDigits: 2,
                                                                          minimumFractionDigits: 2,
                                                                      }).format(transaction.totalAmount)}
                                                                  </p>
                                                              </td>
                                                              <td className='px-5 py-4 border-b border-gray-200 dark:border-gray-800 text-center'>
                                                                  <p className='text-gray-900 dark:text-white'>
                                                                      {new Date(transaction.date).toLocaleTimeString()} -{' '}
                                                                      {new Date(transaction.date).toDateString()}
                                                                  </p>
                                                              </td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          </div>
                                      </div>
                                  </div>
                              </Tab.Panel>

                              </Tab.Panels>
                          </Tab.Group>
                      </div>
                  </div>
              </div>
          )}
      </>
  ); 
};

export default AccountPage;
