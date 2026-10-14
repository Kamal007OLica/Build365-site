import { Capture, Launch, Metrics, TaskCard } from '../ui/visuals';
import Reveal from '../ui/Reveal';

const CARDS = [
  { id: 'capture', cls: '', title: 'Say it. It’s captured.', body: 'Voice notes transcribe live. Press Enter for a note, ⌘Enter for a task.', Visual: Capture },
  { id: 'metrics', cls: '', title: 'The numbers you move.', body: 'KPIs with trends and targets, driven by PostHog queries.', Visual: Metrics },
  { id: 'tasks', cls: '', title: 'Fast, calm lists.', body: 'Group by status, priority or due date, with B365 IDs and labels.', Visual: TaskCard },
  { id: 'launch', cls: 'span3', title: 'A launch desk.', body: 'Play listing versions with a line-by-line diff, mail from every company inbox, reviews with three suggested replies, and a public product board.', Visual: Launch },
];

export default function Features() {
  return (
    <section className="section" id="more" aria-labelledby="more-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">06</span> In the box</p></Reveal>
          <Reveal delay={60}><h2 id="more-h" className="xl">Everything else a small team reaches for.</h2></Reveal>
        </div>
        <div className="bento">
          {CARDS.map(({ id, cls, title, body, Visual }, i) => (
            <Reveal key={id} className={`card-s ${cls}`} delay={(i % 3) * 70}>
              <article className="card-in">
                <Visual />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
