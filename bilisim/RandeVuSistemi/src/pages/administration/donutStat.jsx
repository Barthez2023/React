
import style from './donutstats.module.css'
const DonutStats = ({statsler,onayla,iptal,onayma}) => {
  // Calcul des pourcentages réels (si les données existent)
  const stats = statsler || { onayla: 0, onayma: 0, iptal: 0 };
  const total = onayla + onayma + iptal || 1; // Éviter division par 0

  const getPct = (val) => (val / total) * 100;
  
  const segments = [
    { label: 'Onaylandı', value: onayla, color: '#10b981', pct: getPct(onayla) },
    { label: 'Onaylanmamış', value: onayma, color: '#f59e0b', pct: getPct(onayma) },
    { label: 'İptal Edilmiş', value: iptal, color: '#ef4444', pct: getPct(iptal) },
  ];

  const circumference = 220;
  let currentOffset = 0;

  return (
    <div className={style.analyticsCard}>
      <div className={style.donutContent}>
        <div className={style.chartWrapper}>
          <svg width="120" height="120" viewBox="0 0 100 100" className={style.donutSvg}>
            {/* Cercle de fond (Track) */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            
            {/* Segments dynamiques */}
            {segments.map((s, i) => {
              const dashArray = (s.pct * circumference) / 100;
              const offset = currentOffset;
              currentOffset += dashArray;
              
              return (
                <circle
                  key={i}
                  cx="50" cy="50" r="35"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="10"
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className={style.donutSegment}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
          </svg>
          {/* Texte central pour le total */}
          <div className={style.chartCenter}>
            <span className={style.centerVal}>{onayla + onayma + iptal}</span>
            <span className={style.centerLbl}>Toplam</span>
          </div>
        </div>

        <div className={style.legendGrid}>
          {segments.map((s, i) => (
            <div key={i} className={style.legendRow}>
              <div className={style.legendInfo}>
                <span className={style.dot} style={{ backgroundColor: s.color }} />
                <span className={style.label}>{s.label}</span>
              </div>
              <div className={style.legendData}>
                <span className={style.value}>{s.value}</span>
                <span className={style.percentage}>{Math.round(s.pct)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutStats






// import style from './donutstats.module.css'
// const DonutStats = ({ data }) => {
//   // Calcul des pourcentages réels (si les données existent)
//   const stats = data?.statsMonth || { onaylaMonth: 0, onaymaMonth: 0, iptalMonth: 0 };
//   const total = stats.onaylaMonth + stats.onaymaMonth + stats.iptalMonth || 1; // Éviter division par 0

//   const getPct = (val) => (val / total) * 100;
  
//   const segments = [
//     { label: 'Onaylandı', value: stats.onaylaMonth, color: '#10b981', pct: getPct(stats.onaylaMonth) },
//     { label: 'Onaylanmamış', value: stats.onaymaMonth, color: '#f59e0b', pct: getPct(stats.onaymaMonth) },
//     { label: 'İptal Edilmiş', value: stats.iptalMonth, color: '#ef4444', pct: getPct(stats.iptalMonth) },
//   ];

//   const circumference = 220;
//   let currentOffset = 0;

//   return (
//     <div className={style.analyticsCard}>
//       <div className={style.donutContent}>
//         <div className={style.chartWrapper}>
//           <svg width="120" height="120" viewBox="0 0 100 100" className={style.donutSvg}>
//             {/* Cercle de fond (Track) */}
//             <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            
//             {/* Segments dynamiques */}
//             {segments.map((s, i) => {
//               const dashArray = (s.pct * circumference) / 100;
//               const offset = currentOffset;
//               currentOffset += dashArray;
              
//               return (
//                 <circle
//                   key={i}
//                   cx="50" cy="50" r="35"
//                   fill="none"
//                   stroke={s.color}
//                   strokeWidth="10"
//                   strokeDasharray={`${dashArray} ${circumference}`}
//                   strokeDashoffset={-offset}
//                   strokeLinecap="round"
//                   className={style.donutSegment}
//                   transform="rotate(-90 50 50)"
//                 />
//               );
//             })}
//           </svg>
//           {/* Texte central pour le total */}
//           <div className={style.chartCenter}>
//             <span className={style.centerVal}>{stats.onaylaMonth + stats.onaymaMonth + stats.iptalMonth}</span>
//             <span className={style.centerLbl}>Toplam</span>
//           </div>
//         </div>

//         <div className={style.legendGrid}>
//           {segments.map((s, i) => (
//             <div key={i} className={style.legendRow}>
//               <div className={style.legendInfo}>
//                 <span className={style.dot} style={{ backgroundColor: s.color }} />
//                 <span className={style.label}>{s.label}</span>
//               </div>
//               <div className={style.legendData}>
//                 <span className={style.value}>{s.value}</span>
//                 <span className={style.percentage}>{Math.round(s.pct)}%</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonutStats