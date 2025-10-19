 (async () => {
  const base = 'http://localhost:4000';
  const body = { username: 'testuser', password: 'Test123!' };
  try {
    console.log('--- Register ---');
    let r = await fetch(base + '/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    console.log('register status', r.status);
    const regText = await r.text();
    try { console.log(JSON.parse(regText)); } catch (e) { console.log(regText); }

    console.log('--- Login ---');
    r = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    console.log('login status', r.status);
    const loginText = await r.text();
    let loginJson;
    try { loginJson = JSON.parse(loginText); console.log(loginJson); } catch (e) { console.log(loginText); }
    const token = loginJson && loginJson.token;

    if (!token) {
      console.error('No token returned, aborting');
      return;
    }

    console.log('--- Get Todos ---');
    r = await fetch(base + '/todos/', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    console.log('todos status', r.status);
    const todosText = await r.text();
    try { console.log(JSON.parse(todosText)); } catch (e) { console.log(todosText); }

  } catch (err) {
    console.error('Error in testRequests:', err);
  }
})();
