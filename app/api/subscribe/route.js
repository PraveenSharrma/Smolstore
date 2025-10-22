export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log("New subscriber:", email);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
