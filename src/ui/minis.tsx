import { Apple, Globe, Smartphone } from 'lucide-react';

/** The plan matrix, small: three features, one shared slice, three feature slices. */
export function PlanMini() {
  return (
    <div className="mini pm" aria-hidden="true">
      <div className="pm-col"><span className="pm-h">What people want</span><i>Images on website pages</i><i>File uploads in forms</i><i>Email attachments</i></div>
      <div className="pm-col shared"><span className="pm-h">Build order →</span><b><small>Slice 1</small>Media library<em>Shared · Used by 3 · #12 Done</em></b></div>
      <div className="pm-col"><span className="pm-h">&nbsp;</span><i className="s"><small>Slice 2</small>Image block picker</i><i className="s"><small>Slice 3</small>Form file field</i><i className="s"><small>Slice 4</small>Attachment picker</i></div>
    </div>
  );
}

/** Three platforms at a glance. */
export function PlatformsMini() {
  const rows = [
    { Icon: Smartphone, name: 'Android', store: 'Google Play', v: '2.4.0', st: 'Live', pct: 100, cls: 'live' },
    { Icon: Apple, name: 'iOS', store: 'App Store', v: '1.0.0', st: 'Testing', pct: 0, cls: 'testing' },
    { Icon: Globe, name: 'Web', store: 'zenmodeos.com', v: '0.3.0', st: 'Building', pct: 0, cls: 'building' },
  ];
  return (
    <div className="mini pfm" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.name} className={`pfm-row ${r.cls}`}>
          <r.Icon size={15} />
          <div><b>{r.name}</b><span>{r.store}</span></div>
          <code>v{r.v}</code>
          <div className="meter"><i style={{ width: `${r.pct}%` }} /></div>
          <em>{r.st}</em>
        </div>
      ))}
    </div>
  );
}
