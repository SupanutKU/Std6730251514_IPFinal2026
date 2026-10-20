// Deterministic Lloyd 1D K-Means. Empty tiers have null centroid, not a fake zero.
export function salaryClusters(values) {
  const xs = [...values].sort((a,b)=>a-b);
  if (xs.some(x=>typeof x !== 'number' || !Number.isFinite(x) || x < 0)) throw new Error('Invalid salary');
  const unique = [...new Set(xs)];
  const k = Math.min(3, unique.length);
  if (!k) return [1,2,3].map(i=>({group:`Tier ${i}`,centroid:null,count:0}));
  let centers = Array.from({length:k},(_,i)=>unique[Math.round(i*(unique.length-1)/Math.max(1,k-1))]);
  let groups;
  for(let iteration=0;iteration<200;iteration++) {
    groups = centers.map(()=>[]);
    for(const x of xs) {
      let best=0;
      for(let j=1;j<k;j++) if(Math.abs(x-centers[j])<Math.abs(x-centers[best])) best=j;
      groups[best].push(x);
    }
    const next = groups.map((g,i)=>g.length ? g.reduce((sum,x)=>sum+x,0)/g.length : centers[i]);
    const done = next.every((x,i)=>Math.abs(x-centers[i])<1e-8);
    centers=next;
    if(done) break;
  }
  // Final reassignment makes reported means/counts correspond to one partition.
  groups=centers.map(()=>[]);
  for(const x of xs) {
    let best=0;
    for(let j=1;j<k;j++) if(Math.abs(x-centers[j])<Math.abs(x-centers[best])) best=j;
    groups[best].push(x);
  }
  const result=groups.filter(g=>g.length).map(g=>({centroid:g.reduce((s,x)=>s+x,0)/g.length,count:g.length})).sort((a,b)=>a.centroid-b.centroid);
  while(result.length<3) result.push({centroid:null,count:0});
  return result.map((g,i)=>({group:`Tier ${i+1}`,centroid:g.centroid===null?null:Math.round(g.centroid*100)/100,count:g.count}));
}
