import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import Head from "next/head";

const PerformancePage = () => {
  const router = useRouter();
  const user = useSelector((store) => store.logininfo.user);

  useEffect(() => {
    // Only Super Admin (role 1) can access performance dashboard
    if (user && user.role !== 1) {
      router.push("/admin/dashboard"); // Redirect non-super-admins
    }
  }, [user, router]);

  // Only show to Super Admin
  if (!user || user.role !== 1) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <h3>Access Denied</h3>
          <p>Only Super Administrators can access the Performance Dashboard.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Performance Dashboard | Cadbull Admin</title>
        <meta name="description" content="Monitor website performance, costs, and optimization opportunities" />
      </Head>
      <AdminLayout>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="h3 mb-0 fw-bold">📊 Performance Dashboard</h1>
                  <p className="text-muted mb-0">Monitor page performance, costs, and optimization opportunities</p>
                </div>
                <div className="badge bg-primary fs-6">
                  Super Admin Only
                </div>
              </div>
              
              {/* Performance Dashboard Component */}
              <PerformanceDashboard />
              
              {/* Quick Instructions */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">💡 How to Use This Dashboard</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <h6>📊 Real-time Data</h6>
                          <p className="small">Performance metrics update every 5 minutes from CloudWatch logs.</p>
                        </div>
                        <div className="col-md-4">
                          <h6>🔍 Optimization</h6>
                          <p className="small">Focus on pages with high duration or cost for maximum impact.</p>
                        </div>
                        <div className="col-md-4">
                          <h6>📈 Trends</h6>
                          <p className="small">Monitor memory usage and performance trends over time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default PerformancePage;
