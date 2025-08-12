import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState({
    pagePerformance: [],
    apiPerformance: [],
    memoryUsage: [],
    costAnalysis: [],
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data - replace with actual CloudWatch API calls
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        // Mock data - in production, fetch from CloudWatch API
        const mockData = {
          pagePerformance: [
            { page: 'Homepage', avgDuration: 150, requests: 1250, cost: 0.0234 },
            { page: 'Categories', avgDuration: 280, requests: 890, cost: 0.0456 },
            { page: 'Search', avgDuration: 320, requests: 567, cost: 0.0398 },
            { page: 'Profile', avgDuration: 190, requests: 432, cost: 0.0287 },
            { page: 'CategoryDetail', avgDuration: 240, requests: 678, cost: 0.0345 },
          ],
          apiPerformance: [
            { api: 'getallprojects', avgDuration: 85, calls: 450 },
            { api: 'getSearchResults', avgDuration: 120, calls: 230 },
            { api: 'getSubCategories', avgDuration: 95, calls: 340 },
            { api: 'getUserProjects', avgDuration: 110, calls: 156 },
            { api: 'getCompanyProfile', avgDuration: 45, calls: 289 },
          ],
          memoryUsage: [
            { time: '00:00', memory: 145 },
            { time: '04:00', memory: 167 },
            { time: '08:00', memory: 198 },
            { time: '12:00', memory: 234 },
            { time: '16:00', memory: 201 },
            { time: '20:00', memory: 176 },
          ],
          costAnalysis: [
            { page: 'Homepage', hourlyRequests: 52, hourlyCost: 0.00124 },
            { page: 'Categories', hourlyRequests: 37, hourlyCost: 0.00189 },
            { page: 'Search', hourlyRequests: 24, hourlyCost: 0.00165 },
            { page: 'Profile', hourlyRequests: 18, hourlyCost: 0.00119 },
          ],
        };

        setPerformanceData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setLoading(false);
      }
    };

    fetchPerformanceData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPerformanceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const pagePerformanceChart = {
    labels: performanceData.pagePerformance.map(p => p.page),
    datasets: [
      {
        label: 'Average Duration (ms)',
        data: performanceData.pagePerformance.map(p => p.avgDuration),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const memoryUsageChart = {
    labels: performanceData.memoryUsage.map(m => m.time),
    datasets: [
      {
        label: 'Memory Usage (MB)',
        data: performanceData.memoryUsage.map(m => m.memory),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const costAnalysisChart = {
    labels: performanceData.costAnalysis.map(c => c.page),
    datasets: [
      {
        label: 'Hourly Cost ($)',
        data: performanceData.costAnalysis.map(c => c.hourlyCost),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-dashboard">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2>📊 Performance Dashboard</h2>
            <select 
              className="form-select w-auto"
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div className="row mb-4">
        {performanceData.pagePerformance.slice(0, 4).map((page, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{page.page}</h5>
                <p className="card-text">
                  <span className="badge bg-primary me-2">{page.avgDuration}ms</span>
                  <small className="text-muted">{page.requests} requests</small>
                </p>
                <p className="card-text">
                  <span className="badge bg-success">${page.cost.toFixed(4)}</span>
                  <small className="text-muted"> total cost</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row">
        {/* Page Performance Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>🚀 Page Performance</h5>
            </div>
            <div className="card-body">
              <Bar 
                data={pagePerformanceChart} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Average Response Time by Page' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Duration (ms)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Memory Usage Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>🧠 Memory Usage Trend</h5>
            </div>
            <div className="card-body">
              <Line 
                data={memoryUsageChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Memory Usage Over Time' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Memory (MB)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Cost Analysis Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>💰 Cost Analysis</h5>
            </div>
            <div className="card-body">
              <Bar 
                data={costAnalysisChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Hourly Cost by Page' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Cost ($)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* API Performance Table */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>🌐 API Performance</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>API Endpoint</th>
                      <th>Avg Duration</th>
                      <th>Calls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.apiPerformance.map((api, index) => (
                      <tr key={index}>
                        <td>{api.api}</td>
                        <td>
                          <span className={`badge ${api.avgDuration > 100 ? 'bg-warning' : 'bg-success'}`}>
                            {api.avgDuration}ms
                          </span>
                        </td>
                        <td>{api.calls}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>🚨 Performance Alerts</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="alert alert-warning" role="alert">
                    <strong>⚠️ Slow Page:</strong> Search page averaging 320ms
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="alert alert-info" role="alert">
                    <strong>📈 High Traffic:</strong> Categories page receiving 890 requests
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="alert alert-success" role="alert">
                    <strong>✅ Optimized:</strong> Profile page under 200ms average
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CloudWatch Query Helpers */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>🔍 CloudWatch Query Helpers</h5>
            </div>
            <div className="card-body">
              <p>Use these queries in AWS CloudWatch Log Insights:</p>
              <div className="accordion" id="queryAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="slowestPagesHeading">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#slowestPages">
                      🔥 Find Slowest Pages
                    </button>
                  </h2>
                  <div id="slowestPages" className="accordion-collapse collapse" data-bs-parent="#queryAccordion">
                    <div className="accordion-body">
                      <code className="d-block p-2 bg-light">
                        fields @timestamp, @message<br/>
                        | filter @message like /PERFORMANCE-COMPLETE/<br/>
                        | parse @message /duration: '(?&lt;duration&gt;\d+)ms'/<br/>
                        | sort duration desc<br/>
                        | limit 20
                      </code>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="highestCostHeading">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#highestCost">
                      💰 Find Highest Cost Pages
                    </button>
                  </h2>
                  <div id="highestCost" className="accordion-collapse collapse" data-bs-parent="#queryAccordion">
                    <div className="accordion-body">
                      <code className="d-block p-2 bg-light">
                        fields @timestamp, @message<br/>
                        | filter @message like /COST-EVENT/<br/>
                        | parse @message /estimatedCost: '\$(?&lt;cost&gt;[0-9.]+)'/<br/>
                        | sort cost desc<br/>
                        | limit 20
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
