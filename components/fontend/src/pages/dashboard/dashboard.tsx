import { Link } from 'react-router';
import styles from './dashboard.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function Dashboard() {
    function closeModal() {
        // throw new Error('Function not implemented.');
    }

    function showEventDetails() {
        // throw new Error('Function not implemented.');
    }

    return (

        <div className={`${cx('wrapper', 'gradient-bg')} bg-[#191970] min-h-screen text-white font-sans`}>
            <div className="flex h-screen overflow-hidden">
                {/* <!-- Sidebar --> */}
                <div className={`${cx('sidebar')} hidden md:flex md:flex-shrink-0`}>
                    <div className={`${cx('sidebar-inner', 'gradient-bg')} flex flex-col w-64 text-white`}>
                        <div className={`${cx('sidebar-header')} flex items-center justify-center h-16 px-4 border-b border-blue-800`}>
                            <div className={`${cx('logo-container')} flex items-center`}>
                                <i className="fas fa-coins text-2xl text-yellow-400 mr-2"></i>
                                <span className={`${cx('logo-text')} text-xl font-bold`}>CryptoDash</span>
                            </div>
                        </div>
                        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
                            <nav className={`${cx('nav')} flex-1 space-y-2`}>
                                <a id="dashboard-tab" className={`${cx('nav-link', 'active')} flex items-center px-4 py-3 text-sm font-medium rounded-md bg-blue-900 text-white`}>
                                    <i className="fas fa-tachometer-alt mr-3"></i>
                                    <Link to="/">Dashboard</Link>
                                </a>
                                <a id="swap-tab" className={`${cx('nav-link')} flex items-center px-4 py-3 text-sm font-medium rounded-md text-blue-200 hover:bg-blue-800 hover:text-white`}>
                                    <i className="fas fa-exchange-alt mr-3"></i>
                                    <Link to="/swap">Swap</Link>
                                </a>
                                <a id="wallet-tab" className={`${cx('nav-link')} flex items-center px-4 py-3 text-sm font-medium rounded-md text-blue-200 hover:bg-blue-800 hover:text-white`}>
                                    <i className="fas fa-wallet mr-3"></i>
                                    <Link to="/collection">My wallet</Link>
                                </a>
                                <a id="market-tab" className={`${cx('nav-link')} flex items-center px-4 py-3 text-sm font-medium rounded-md text-blue-200 hover:bg-blue-800 hover:text-white`}>
                                    <i className="fas fa-chart-line mr-3"></i>
                                    <Link to="/maket_place">Market</Link>
                                </a>
                                <a id="events-tab" className={`${cx('nav-link')} flex items-center px-4 py-3 text-sm font-medium rounded-md text-blue-200 hover:bg-blue-800 hover:text-white`}>
                                    <i className="fas fa-calendar-alt mr-3"></i>
                                    <Link to="/events">Events</Link>
                                </a>
                                <a id="create-event-tab" className={`${cx('nav-link')} flex items-center px-4 py-3 text-sm font-medium rounded-md text-blue-200 hover:bg-blue-800 hover:text-white`}>
                                    <i className="fas fa-plus-circle mr-3"></i>
                                    <Link to="/event_create">Create Event</Link>
                                </a>
                            </nav>
                        </div>
                        <div className={`${cx('profile')} p-4 border-t border-blue-800`}>
                            <div className={`${cx('profile-container')} flex items-center`}>
                                <img className={`${cx('avatar')} w-10 h-10 rounded-full`} src="https://randomuser.me/api/portraits/women/44.jpg" alt="User avatar" />
                                <div className={`${cx('user-info')} ml-3`}>
                                    <p className={`${cx('user-name')} text-sm font-medium`}>Jane Smith</p>
                                    <p className={`${cx('user-role')} text-xs text-blue-200`}>Premium Member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile sidebar */}
                <div className={`${cx('mobile-sidebar')} md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10`}>
                    <div className={`${cx('mobile-nav')} flex justify-around`}>
                        <a className={`${cx('mobile-nav-link', 'active')} flex flex-col items-center justify-center p-3 text-blue-500`}>
                            <i className="fas fa-tachometer-alt"></i>
                            <span className="text-xs mt-1">
                                <Link to="/">Dashboard</Link>
                            </span>
                        </a>
                        <a  className={`${cx('mobile-nav-link')} flex flex-col items-center justify-center p-3 text-gray-500`}>
                            <i className="fas fa-exchange-alt"></i>
                            <span className="text-xs mt-1">
                                <Link to="/swap">Swap</Link>
                            </span>
                        </a>
                        <a  className={`${cx('mobile-nav-link')} flex flex-col items-center justify-center p-3 text-gray-500`}>
                            <i className="fas fa-wallet"></i>
                            <span className="text-xs mt-1">
                                <Link to="/collection">Wallet</Link>
                            </span>
                        </a>
                        <a className={`${cx('mobile-nav-link')} flex flex-col items-center justify-center p-3 text-gray-500`}>
                            <i className="fas fa-ellipsis-h"></i>
                            <span className="text-xs mt-1">
                                <Link to="/more">More</Link>
                            </span>
                        </a>
                    </div>
                </div>

                {/* <!-- Main content --> */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Top navigation */}
                    <div className={`${cx('top-nav')} flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200`}>
                        <div className={`${cx('mobile-menu')} flex items-center md:hidden`}>
                            <button className="text-gray-500 focus:outline-none">
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                        <div className={`${cx('search-container')} flex-1 px-4`}>
                            <div className={`${cx('search-wrapper')} relative max-w-md`}>
                                <div className={`${cx('search-icon')} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                    <i className="fas fa-search text-gray-400"></i>
                                </div>
                                <input className={`${cx('search-input')} block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-transparent rounded-md focus:bg-white focus:border-gray-300 focus:outline-none`} placeholder="Search..." />
                            </div>
                        </div>
                        <div className={`${cx('user-actions')} flex items-center`}>
                            <button className={`${cx('notification-btn')} p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none`}>
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className={`${cx('user-menu')} ml-3 relative`}>
                                <div>
                                    <button className={`${cx('user-menu-btn')} flex items-center max-w-xs text-sm rounded-full focus:outline-none`}>
                                        <img className={`${cx('user-avatar')} w-8 h-8 rounded-full`} src="https://randomuser.me/api/portraits/women/44.jpg" alt="User avatar" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className={`${cx('main-content')} flex-1 overflow-auto p-4 bg-gray-50`}>
                        {/* Dashboard Content (default visible) */}
                        <div id="dashboard-content" className={`${cx('dashboard-content')} content-section`}>
                            <div className={`${cx('header')} mb-6`}>
                                <h1 className={`${cx('title')} text-2xl font-bold text-gray-800`}>Dashboard</h1>
                                <p className={`${cx('subtitle')} text-gray-600`}>Welcome back, Jane! Here's what's happening with your portfolio.</p>
                            </div>

                            {/* Stats Cards */}
                            <div className={`${cx('stats-grid')} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6`}>
                                <div className={`${cx('stat-card')} bg-white rounded-lg shadow p-6 card-hover transition duration-300`}>
                                    <div className={`${cx('stat-content')} flex items-center`}>
                                        <div className={`${cx('stat-icon')} p-3 rounded-full bg-blue-100 text-blue-600`}>
                                            <i className="fas fa-wallet"></i>
                                        </div>
                                        <div className={`${cx('stat-info')} ml-4`}>
                                            <p className={`${cx('stat-label')} text-sm font-medium text-gray-500`}>Total Balance</p>
                                            <p className={`${cx('stat-value')} text-xl font-semibold text-gray-800`}>$24,895.00</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-green-500 text-sm font-medium">+12.5%</span>
                                        <span className="text-gray-500 text-sm ml-2">vs last month</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 card-hover transition duration-300">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                                            <i className="fas fa-arrow-up"></i>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Total Profit</p>
                                            <p className="text-xl font-semibold text-gray-800">$4,250.00</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-green-500 text-sm font-medium">+8.2%</span>
                                        <span className="text-gray-500 text-sm ml-2">vs last month</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 card-hover transition duration-300">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                            <i className="fas fa-coins"></i>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Crypto Assets</p>
                                            <p className="text-xl font-semibold text-gray-800">12</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-green-500 text-sm font-medium">+3</span>
                                        <span className="text-gray-500 text-sm ml-2">new assets</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 card-hover transition duration-300">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                            <i className="fas fa-calendar-alt"></i>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                                            <p className="text-xl font-semibold text-gray-800">5</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-red-500 text-sm font-medium">-2</span>
                                        <span className="text-gray-500 text-sm ml-2">from last week</span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Portfolio Chart --> */}
                            <div className="bg-white rounded-lg shadow p-6 mb-6 card-hover transition duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Portfolio Value</h2>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md">1D</button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">1W</button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">1M</button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">1Y</button>
                                    </div>
                                </div>
                                <div className="h-64">
                                    {/* <!-- Chart placeholder --> */}
                                    <div className="flex items-center justify-center h-full bg-gray-50 rounded">
                                        <p className="text-gray-400">Portfolio chart will appear here</p>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Recent Transactions and Upcoming Events --> */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                                <div className="bg-white rounded-lg shadow overflow-hidden card-hover transition duration-300">
                                    <div className="p-6">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                                        <div className="transaction-list overflow-y-auto" style={{ maxHeight: '300px' }}>
                                            <div className="flex items-center py-3 border-b border-gray-100">
                                                <div className="p-2 rounded-full bg-green-100 text-green-600">
                                                    <i className="fas fa-arrow-down"></i>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm font-medium text-gray-800">Received Bitcoin</p>
                                                    <p className="text-xs text-gray-500">Today, 10:45 AM</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-800">+0.025 BTC</p>
                                                    <p className="text-xs text-gray-500">$750.00</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center py-3 border-b border-gray-100">
                                                <div className="p-2 rounded-full bg-red-100 text-red-600">
                                                    <i className="fas fa-arrow-up"></i>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm font-medium text-gray-800">Sent Ethereum</p>
                                                    <p className="text-xs text-gray-500">Yesterday, 3:22 PM</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-800">-1.2 ETH</p>
                                                    <p className="text-xs text-gray-500">$2,100.00</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center py-3 border-b border-gray-100">
                                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                    <i className="fas fa-exchange-alt"></i>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm font-medium text-gray-800">Swap completed</p>
                                                    <p className="text-xs text-gray-500">Yesterday, 11:10 AM</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-800">BTC → SOL</p>
                                                    <p className="text-xs text-gray-500">$450.00</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center py-3">
                                                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                                    <i className="fas fa-shopping-bag"></i>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="text-sm font-medium text-gray-800">NFT Purchase</p>
                                                    <p className="text-xs text-gray-500">May 12, 9:30 AM</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-800">-0.5 ETH</p>
                                                    <p className="text-xs text-gray-500">$875.00</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Upcoming Events --> */}
                                <div className="bg-white rounded-lg shadow overflow-hidden card-hover transition duration-300">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
                                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
                                        </div>

                                        <div className="space-y-4">
                                            {/* <!-- Event 1 --> */}
                                            <div className="event-card bg-gray-50 rounded-lg p-4"
                                            // onClick={() => showEventDetails('event1')}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <h3 className="text-md font-medium text-gray-800">Crypto Summit 2023</h3>
                                                            <span className="event-badge bg-blue-100 text-blue-800 rounded-full ml-2">Conference</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">Hosted by Blockchain Association</p>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        <i className="far fa-calendar-alt mr-1"></i> Jun 15
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">The largest gathering of crypto enthusiasts discussing the future of blockchain technology and decentralized finance.</p>
                                            </div>

                                            {/* <!-- Event 2 --> */}
                                            <div className="event-card bg-gray-50 rounded-lg p-4"
                                            // onClick={() => showEventDetails('event2')}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <h3 className="text-md font-medium text-gray-800">NFT Workshop</h3>
                                                            <span className="event-badge bg-purple-100 text-purple-800 rounded-full ml-2">Workshop</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">Hosted by Digital Art Collective</p>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        <i className="far fa-calendar-alt mr-1"></i> Jun 22
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">Learn how to create, mint and sell your own NFTs from industry experts in this hands-on workshop.</p>
                                            </div>

                                            {/* <!-- Event 3 --> */}
                                            <div className="event-card bg-gray-50 rounded-lg p-4"
                                            // onClick={() => showEventDetails('event3')}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <h3 className="text-md font-medium text-gray-800">DeFi Meetup</h3>
                                                            <span className="event-badge bg-green-100 text-green-800 rounded-full ml-2">Meetup</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">Hosted by DeFi Alliance</p>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        <i className="far fa-calendar-alt mr-1"></i> Jun 28
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">Monthly gathering of DeFi enthusiasts to discuss the latest trends and opportunities in decentralized finance.</p>
                                            </div>
                                        </div>

                                        <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                                            View All Events
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Other content sections (Swap, Wallet, Market, Events, Create Event) remain the same -->
                <!-- ... --> */}

                    </div>
                </div>
            </div>

            {/* <!-- Event Details Modal --> */}
            <div id="eventModal" className="fixed inset-0 z-50 hidden overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modalTitle">Event Title</h3>
                                        <button type="button"
                                        // onClick={closeModal()} className="text-gray-400 hover:text-gray-500"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <i className="far fa-calendar-alt mr-2"></i>
                                            <span id="modalDate">June 15-17, 2023</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <i className="fas fa-map-marker-alt mr-2"></i>
                                            <span id="modalLocation">New York, USA</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <i className="fas fa-user-tie mr-2"></i>
                                            <span id="modalHost">Hosted by Blockchain Association</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4" id="modalDescription">
                                            Detailed event description will appear here.
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <i className="fas fa-users mr-2"></i>
                                            <span id="modalAttendees">25 people attending</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Register Now
                            </button>
                            <button type="button"
                                // onClick={closeModal()} 
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <script>
        // Tab switching functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Get all tab links
            const tabLinks = document.querySelectorAll('nav a, .md\\:hidden a');
            
            // Get all content sections
            const contentSections = document.querySelectorAll('.content-section');
            
            // Function to switch tabs
            function switchTab(event, tabId) {
                event.preventDefault();
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.add('hidden');
                });
                
                // Show the selected content section
                document.getElementById(tabId + '-content').classList.remove('hidden');
                
                // Update active tab styling for desktop
                tabLinks.forEach(link => {
                    if (link.id === tabId + '-tab') {
                        link.classList.remove('text-blue-200', 'hover:bg-blue-800', 'hover:text-white');
                        link.classList.add('bg-blue-900', 'text-white');
                    } else if (link.id && link.id.endsWith('-tab')) {
                        link.classList.remove('bg-blue-900', 'text-white');
                        link.classList.add('text-blue-200', 'hover:bg-blue-800', 'hover:text-white');
                    }
                });
                
                // Update active tab styling for mobile
                const mobileTabs = document.querySelectorAll('.md\\:hidden a');
                mobileTabs.forEach(tab => {
                    if (tab.textContent.trim().toLowerCase() === tabId) {
                        tab.classList.add('active-tab');
                        tab.classList.remove('text-gray-500');
                        tab.classList.add('text-blue-500');
                    } else {
                        tab.classList.remove('active-tab');
                        tab.classList.add('text-gray-500');
                        tab.classList.remove('text-blue-500');
                    }
                });
            }
            
            // Add click event listeners to all tab links
            tabLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    const tabId = this.id.replace('-tab', '');
                    switchTab(event, tabId);
                });
            });
            
            // Set dashboard as default active tab
            switchTab(new Event('click'), 'dashboard');
        });

        // Event details modal functions
        function showEventDetails(eventId) {
            // In a real app, you would fetch event details based on the eventId
            // For this example, we'll use mock data
            const eventData = {
                'event1': {
                    title: 'Crypto Summit 2023',
                    date: 'June 15-17, 2023',
                    location: 'New York, USA',
                    host: 'Blockchain Association',
                    description: 'The largest gathering of crypto enthusiasts, developers, and investors discussing the future of blockchain technology. This 3-day conference will feature keynote speeches, panel discussions, and networking opportunities with industry leaders.',
                    attendees: '125 people attending'
                },
                'event2': {
                    title: 'NFT Workshop',
                    date: 'June 22, 2023',
                    location: 'Online Event',
                    host: 'Digital Art Collective',
                    description: 'Learn how to create, mint, and sell your own NFTs from industry experts in this 3-hour intensive workshop. We\'ll cover everything from digital art creation to smart contract deployment and marketing strategies.',
                    attendees: '68 people attending'
                },
                'event3': {
                    title: 'DeFi Meetup',
                    date: 'June 28, 2023',
                    location: 'San Francisco, USA',
                    host: 'DeFi Alliance',
                    description: 'Monthly gathering of DeFi enthusiasts to discuss the latest trends, projects, and opportunities in decentralized finance. This month we\'ll be focusing on yield farming strategies and risk management.',
                    attendees: '42 people attending'
                }
            };

            const event = eventData[eventId] || eventData['event1'];
            
            document.getElementById('modalTitle').textContent = event.title;
            document.getElementById('modalDate').textContent = event.date;
            document.getElementById('modalLocation').textContent = event.location;
            document.getElementById('modalHost').textContent = 'Hosted by ' + event.host;
            document.getElementById('modalDescription').textContent = event.description;
            document.getElementById('modalAttendees').textContent = event.attendees;
            
            document.getElementById('eventModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('eventModal').classList.add('hidden');
        }

        // Close modal when clicking outside of it
        window.onclick = function(event) {
            const modal = document.getElementById('eventModal');
            if (event.target === modal) {
                closeModal();
            }
        }
    </script> */}
        </div>
    );
}

export default Dashboard;