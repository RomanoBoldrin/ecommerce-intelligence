export default function Index() {
  return null;
}

export async function getServerSideProps(context) {
  const sessionId = context.req.cookies?.session_id;

  return {
    redirect: {
      destination: sessionId ? "/dashboard" : "/login",
      permanent: false,
    },
  };
}
