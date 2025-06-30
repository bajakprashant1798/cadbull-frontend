// pages/logout.js
export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/api/proxy-logout',
      permanent: false,
    },
  };
}

export default function Logout() {
  return null;
}
