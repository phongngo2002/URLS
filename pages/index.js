
// import handler from './api/hello'
export default function Home(props) {
  async function abd(i, duLieu) {
    const response = await fetch(`http://localhost:3000/api/hello2`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: duLieu.data[i].id,
        link: `https://khoahoc.tv${duLieu.data[i].slug}`
      }),
    });
    if (response) {
      i++;
      if (i < duLieu.data.length) {
        abd(i, duLieu);
      }
    }
  }
  return (<div style={{ width: '1080px', margin: 'auto', textAlign: 'center' }}>
    <button style={{ backgroundColor: 'black', color: 'white', width: '100px', height: '75px' }} onClick={() => {
      fetch(`http://localhost:3000/api/hello`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify('https://khoahoc.tv/'),
      })
        .then(response => response.json())
        .then(data => abd(0, data));
    }}>Call APi</button>
  </div>);
}
