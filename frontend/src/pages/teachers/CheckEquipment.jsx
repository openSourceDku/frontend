import { useState, useEffect } from 'react';
import { getFixtures } from '../../api/teacher';

function CheckEquipment() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await getFixtures();
        setFixtures(response.fixtures);
      } catch (error) {
        console.error('Error fetching fixtures:', error);
        setFixtures([]);
      }
    };
    fetchFixtures();
  }, []);

  return (
    <div style={styles.container}>
      <h1>비품 확인</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>품명</th>
            <th style={styles.th}>가격</th>
            <th style={styles.th}>수량</th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map((fixture, index) => (
            <tr key={index} style={styles.tr}>
              <td style={styles.td}>{fixture.name}</td>
              <td style={styles.td}>{fixture.price.toLocaleString()}원</td>
              <td style={styles.td}>{fixture.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
  },
  tr: {
    ':nth-child(even)': {
      backgroundColor: '#f9f9f9',
    },
  },
};

export default CheckEquipment;