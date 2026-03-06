import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

// logic: building the admin dashboard
// the idea is that in backend i create analytics data (already done in backend) through $group stages (aggregation) and i receive a json array of daily sales. 
// i then map that directly into the recharts library to create nice visual charts showing sales and other data. 
// also i am making sure here that this view is strictly protected. bcuz i m using fetch, my browser's httponly jwt cookie is sent to the backend. 
// if the user doesnt have the admin role, the server rejects the request with a 403 error and my frontend catches it and the user is redirected.
// https://github.com/bradtraversy/proshop-v2
// https://github.com/joshu1024/Analytics-Dashboard---MERN
// https://github.com/MudassarNazir956/React_Admin_Dashboard

const AdminDashboard = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // logic: fetching the aggregated data from my backend. 
        // also, the vite proxy routes it to port 3000 and my browser sends the httponly jwt cookie automatically to pass my protect and admin middlewares.
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/sales');
                if (res.ok) {
                    const data = await res.json();
                    setSalesData(data);
                    setLoading(false);

                    ////////////TESTING
                    // console.log('TESTING: loaded sales data for recharts:', data);
                    ////////////
                } else {
                    // logic: if a non admin user tries to gain access to /admin through the url, set 403 error.
                    setError('not authorized to view this dashboard.');
                    setLoading(false);
                    // then putting them back to the home page after 2 seconds
                    setTimeout(() => navigate('/'), 2000);
                }
            } catch (err) {
                setError('network error. could not load analytics.');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [navigate]);

    
    if (loading) return <h2 className="loading-text">Loading business analytics...</h2>;

    // logic: using my red text class to display access errors clearly
    if (error) return <div className="main_container"><h2 className="out-of-stock-text">{error}</h2></div>;

    return (
        <div className="main_container">
            <h1>Revenue Analytics</h1>

            {/* checking if we actually have sales data to show */}
            {salesData.length === 0 ? (
                <p className="loading-text">No sales data available yet....</p>
            ) : (
                <div className="card">
                    {/* using recharts responsive container to make sure the graph scales on mobile devices properly without overflowing the screen. */}
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            {/* logic: mapping the x-axis to the _id field from our mongodb aggregation pipeline (which holds the date string) */}
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            {/* mapping the bars to the totalrevenue field we calculated on the backend */}
                            <Bar dataKey="totalRevenue" fill="#003366" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;