/** The two hairlines that run the height of the page, on the content edges.
 *  Everything else that draws a stroke (section rules, corner ticks, column
 *  rules) lines up with them, so the page reads as one drawing. */
export default function Rails() {
  return <div className="rails" aria-hidden="true"><i /><i /></div>;
}
