export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/blog/',
      permanent: true,
    },
  };
}

export default function BlogRedirect() {
  return null;
}
