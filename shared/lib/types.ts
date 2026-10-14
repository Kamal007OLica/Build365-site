export type ViewId =
  | 'inbox' | 'dashboard' | 'whiteboard' | 'knowledge' | 'figma' | 'rooms' | 'plan' | 'claude' | 'github' | 'tasks' | 'analytics' | 'platforms' | 'store' | 'appstore' | 'web' | 'mail' | 'reviews' | 'product' | 'brand' | 'quick' | 'feedback' | 'broadcast' | 'settings' | 'browser';

/** A reference link attached to a task. */
export type TaskLink = { id: string; url: string; title: string };

export type Task = {
  id: string;
  /** Sequential number shown as B365-12. Todoist tasks have none. */
  number?: number;
  labels?: string[];
  title: string;
  notes?: string;
  status: 'todo' | 'doing' | 'done';
  priority: 1 | 2 | 3 | 4;
  due: string | null;
  /** Reference links (docs, designs, PRs) people attach to the task. */
  links?: TaskLink[];
  /** Member name; shown on the dashboard's weekly goals. */
  assignee?: string | null;
  project?: string | null;
  source: 'local' | 'todoist';
  externalId?: string;
  url?: string;
  createdAt: string;
  updatedAt?: string;
};

export type NoteKind = 'note' | 'voice' | 'clip' | 'message';

export type Note = {
  id: string;
  kind: NoteKind;
  source: 'app' | 'voice' | 'extension' | 'telegram' | 'cli';
  title: string;
  text: string;
  url: string | null;
  image: string | null;
  audio?: string | null;
  tags: string[];
  pinned: boolean;
  author: string | null;
  chat?: string | null;
  comment?: string | null;
  outgoing?: boolean;
  createdAt: string;
};

export type Reminder = { id: string; text: string; at: string; done: boolean; createdAt: string };

export type VisionItem = {
  id: string;
  title: string;
  description: string;
  horizon: 'now' | 'next' | 'later';
  progress: number;
  hue: number;
  startDate: string;
  targetDate: string;
  milestones: { name: string; date: string }[];
  createdAt: string;
};

export type Kpi = {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number | null;
  goodDirection: 'up' | 'down';
  source: 'manual' | 'posthog';
  query?: string;
  history: number[];
  error?: string | null;
  updatedAt: string;
};

export type FigmaFile = { id: string; name: string; url: string; key: string; createdAt: string };

export type BoardItemType = 'sticky' | 'rect' | 'round' | 'ellipse' | 'diamond' | 'triangle' | 'text' | 'path' | 'connector' | 'section' | 'stamp' | 'image' | 'link';
export type ConnectorSide = 'auto' | 't' | 'r' | 'b' | 'l';
export type ConnectorEnd = { id: string; side: ConnectorSide };
export type BoardItem = {
  id: string;
  type: BoardItemType;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  text?: string;
  points?: number[];
  fontSize?: number;
  z: number;
  locked?: boolean;
  author?: string;
  /** Sections and links. */
  title?: string;
  /** Pen strokes. */
  highlight?: boolean;
  weight?: number;
  /** Connectors: what each end is attached to (unset = free), and how it looks. */
  from?: ConnectorEnd;
  to?: ConnectorEnd;
  style?: 'straight' | 'elbow' | 'curved';
  startCap?: 'none' | 'arrow' | 'open' | 'dot' | 'bar';
  endCap?: 'none' | 'arrow' | 'open' | 'dot' | 'bar';
  dash?: 'solid' | 'dashed' | 'dotted';
  /** Stamps. */
  emoji?: string;
  /** Images. */
  src?: string;
  /** Links. */
  url?: string;
  provider?: string;
  kbId?: string;
};
export type BoardMeta = {
  id: string;
  name: string;
  rev: number;
  itemCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string } | null;
};
export type BoardComment = {
  id: string;
  x: number;
  y: number;
  itemId?: string;
  text: string;
  author: { id: string; name: string };
  createdAt: string;
  resolved: boolean;
  replies: { id: string; text: string; author: { id: string; name: string }; createdAt: string }[];
};
export type BoardVersion = { id: string; name: string; at: string; by: { id: string; name: string }; auto: boolean; itemCount: number };
export type Board = BoardMeta & { items: BoardItem[]; comments: BoardComment[]; versions: BoardVersion[] };
export type Peer = { clientId: string; user: { id: string; name: string }; x?: number; y?: number; selection?: string[]; at: number };

export type KbSpace = { id: string; name: string; description: string; icon: string; hue: number; order: number; createdAt: string; createdBy: { id: string; name: string } };
export type KbKind = 'folder' | 'page' | 'file' | 'link';
export type KbItem = {
  id: string;
  spaceId: string;
  parentId: string | null;
  kind: KbKind;
  name: string;
  order: number;
  tags: string[];
  starred: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string };
  updatedBy: { id: string; name: string };
  trashedAt?: string;
  trashRoot?: boolean;
  trashedFor?: string;
  note?: string;
  /** Pages. `body` is only present when the page was fetched on its own. */
  body?: string;
  excerpt?: string;
  size?: number;
  rev?: number;
  refs?: string[];
  versions?: { id: string; at: string; by: { id: string; name: string }; size: number }[];
  /** Links. */
  url?: string;
  provider?: string;
  linkKind?: string;
  /** Files. */
  file?: { id: string; name: string; size: number; mime: string; url?: string };
  /** Pages and files: where this copy came from and is still being edited (an Evernote note, a Drive doc). */
  sourceUrl?: string;
  sourceProvider?: string;
  sourceAt?: string;
};
export type Kb = { spaces: KbSpace[]; items: KbItem[] };
export type LinkInfo = { url: string; provider: string; label: string; kind: string; host: string; embedUrl: string | null; suggestedName: string };

export type Data = {
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
  vision: VisionItem[];
  kpis: Kpi[];
  figmaFiles: FigmaFile[];
  boards: BoardMeta[];
};

export type Collection = 'tasks' | 'notes' | 'reminders' | 'vision' | 'kpis' | 'figmaFiles';

export type LlmStatus = {
  preference: string;
  active: 'ollama' | 'openai' | 'claude-cli' | 'anthropic' | 'offline';
  model: string | null;
  available: Record<string, { models?: string[]; version?: string } | null>;
};

export type SourceId = 'workspace' | 'claude' | 'knowledge' | 'github' | 'figma' | 'posthog' | 'chatgpt' | 'mcp';

export type Status = {
  version: string;
  workspace: string;
  workspaceName: string;
  user: { id: string; name: string; email: string; role: 'owner' | 'member' } | null;
  /** Whether this person may use the terminal on this server. */
  terminal: boolean;
  /** Largest file the knowledge base accepts, in bytes. */
  maxUpload?: number;
  /** Which chat sources have content right now. */
  sources: Record<SourceId, boolean>;
  llm: LlmStatus;
  integrations: Record<'github' | 'todoist' | 'posthog' | 'telegram' | 'figma' | 'spotify' | 'beeper', boolean>;
  /** Where Spotify sends the browser after sign-in; must be registered in the Spotify app. */
  spotifyRedirectUri?: string;
  demo?: boolean;
};

export type Settings = {
  workspace: string;
  theme: 'dark' | 'light' | 'system';
  llm: {
    provider: string;
    ollamaUrl: string;
    ollamaModel: string;
    openaiUrl: string;
    openaiModel: string;
    anthropicKey: string;
    anthropicModel: string;
  };
  github: { token: string; repo: string };
  todoist: { token: string };
  posthog: { host: string; projectId: string; apiKey: string };
  telegram: { botToken: string; chatId: string };
  figma: { token: string };
  spotify: { clientId: string; refreshToken: string };
  beeper: { url: string; token: string; tokenExpiresAt: string | null; clientId: string; clientRedirect: string };
  sync: { repo: string; branch: string; auto: boolean; intervalMin: number };
  terminal: { shell: string };
  secrets: Record<string, string>;
};

export type SearchResult = { id: string; kind: string; source?: SourceId; title: string; view?: ViewId; score: number; snippet: string };

export type McpTool = { name: string; title?: string | null; description: string; inputSchema: Record<string, unknown> };
export type McpServer = {
  id: string;
  slug: string;
  name: string;
  description: string;
  transport: 'http' | 'stdio';
  url: string;
  headers: Record<string, string>;
  command: string;
  args: string[];
  env: Record<string, string>;
  enabled: boolean;
  allowTools: boolean;
  createdAt: string;
  inspection: {
    ok: boolean;
    error: string | null;
    checkedAt: string;
    serverInfo?: { name: string; title?: string; version?: string } | null;
    tools: McpTool[];
    resources: { uri: string; name: string; description: string }[];
  } | null;
};
export type ApiParam = { name: string; in: 'path' | 'query' | 'body'; type: 'string' | 'number' | 'boolean'; required: boolean; description: string };
export type ApiEndpoint = { name: string; method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; path: string; description: string; params: ApiParam[] };
export type ApiConnector = {
  id: string;
  slug: string;
  name: string;
  description: string;
  baseUrl: string;
  auth: { type: 'none' | 'bearer' | 'header' | 'query'; name: string; value: string };
  endpoints: ApiEndpoint[];
  enabled: boolean;
  allowTools: boolean;
  createdAt: string;
  mcpUrl: string;
};
export type ConnectorsState = {
  mcp: McpServer[];
  apis: ApiConnector[];
  chatgpt: { importedAt: string | null; count: number };
  sources: Record<SourceId, boolean>;
  /** Whether this server allows local (command) MCP servers. */
  localMcp?: boolean;
  build365: { url: string; tools: { name: string; description: string; readOnly: boolean }[] };
};

// --- rooms: a conversation, its tickets and the agents building them ----------------------------

export type RoomStep = { id: string; tool: string; label: string; detail: string | null; at: string; status: 'done' | 'running' };
export type RoomAgent = {
  id: string;
  name: string;
  role: 'coordinator' | 'worker';
  status: 'idle' | 'queued' | 'working' | 'review' | 'done' | 'stopped' | 'failed';
  taskId?: string;
  taskNumber?: number;
  title?: string;
  model: string | null;
  cwd?: string | null;
  steps: RoomStep[];
  files: { path: string; content?: string; at: string }[];
  startedAt: string;
  finishedAt?: string | null;
  summary?: string | null;
};
export type RoomMessage = { id: string; role: 'user' | 'coordinator' | 'worker' | 'system'; agentId?: string; author: string; text: string; steps: RoomStep[]; at: string; done: boolean };
export type RoomTicket = { taskId: string; number: number; title: string; createdAt: string };
export type Room = {
  id: string;
  name: string;
  project: string;
  status: 'idle' | 'working' | 'review' | 'done';
  createdAt: string;
  updatedAt: string;
  source: { url: string; title: string } | null;
  messages: RoomMessage[];
  agents: RoomAgent[];
  tickets: RoomTicket[];
};
export type RoomSummary = Pick<Room, 'id' | 'name' | 'project' | 'status' | 'createdAt' | 'updatedAt' | 'source'> & {
  agents: Pick<RoomAgent, 'id' | 'name' | 'role' | 'status'>[];
  tickets: number;
  last: { role: string; text: string; at: string } | null;
};

// --- plans: a vertical-slice matrix --------------------------------------------------------------

export type PlanFeature = { id: string; title: string };
export type PlanSlice = { id: string; title: string; kind: 'shared' | 'feature'; usedBy: string[]; needs?: string[]; order: number; status: 'todo' | 'doing' | 'done'; notes: string; taskId?: string; taskNumber?: number };
export type Plan = { id: string; title: string; summary: string; features: PlanFeature[]; slices: PlanSlice[]; createdAt: string };

// --- platforms: where the product ships ------------------------------------------------------------

export type PlatformId = 'android' | 'ios' | 'web';
export type Platform = {
  id: PlatformId;
  name: string;
  store: string;
  version: string;
  build: string;
  status: 'live' | 'review' | 'testing' | 'building' | 'planned';
  rollout: number;
  url: string;
  releasedAt: string | null;
  next: { version: string; target: string; notes: string };
  checklist: { id: string; text: string; done: boolean }[];
};

export type SpotifyNow =
  | { active: false; playing: false; device: string | null }
  | { active: true; playing: boolean; title: string; artist: string; album: string; image: string | null; url: string | null; progressMs: number; durationMs: number; device: string | null };

/** A chat a broadcast can go to: a person (single) or a group, on any network Beeper bridges. */
export type BroadcastTarget = {
  chatID: string;
  accountID: string;
  network: string;
  title: string;
  type: 'single' | 'group';
  fullName: string;
  firstName: string;
  members: number | null;
  readOnly?: boolean;
  muted?: boolean;
  archived?: boolean;
  lastActivity?: string | null;
};
export type BroadcastResult = {
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'skipped';
  at?: string;
  text?: string;
  error?: string | null;
  reason?: string;
  attempts?: number;
  messageID?: string | null;
};
export type Pace = { preset: 'careful' | 'normal' | 'fast' | 'custom'; minDelaySec: number; maxDelaySec: number; dailyCap: number; skipRecentDays: number };
export type CampaignStatus = 'draft' | 'running' | 'paused' | 'done' | 'cancelled';
export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  message: string;
  attachment: { url: string; name: string; mime: string } | null;
  targets: BroadcastTarget[];
  pace: Pace;
  results: Record<string, BroadcastResult>;
  origin: 'app' | 'mcp';
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  /** Epoch ms of the next send while running. */
  nextAt: number | null;
  note: string | null;
  stats: { total: number; pending: number; sending: number; sent: number; failed: number; skipped: number };
};
export type Audience = { id: string; name: string; targets: BroadcastTarget[]; createdAt: string; updatedAt: string };
export type OptOut = { chatID: string; title: string; network: string; at: string };
export type BroadcastState = { campaigns: Campaign[]; audiences: Audience[]; optOuts: OptOut[]; sentLast24h: number; minGapSec: number };
export type BeeperStatus = {
  url: string;
  reachable: boolean;
  version: string | null;
  connected: boolean;
  expiresAt: string | null;
  accounts: { accountID: string; network: string; status: string; user: string | null }[];
  error: string | null;
};

/** Workspace sync through a git repository (Settings → Sync). */
export type SyncStatus = {
  configured: boolean;
  repo: string;
  branch: string;
  auto: boolean;
  intervalMin: number;
  running: boolean;
  lastSyncAt: string | null;
  lastError: string | null;
  lastErrorAt: string | null;
  lastResult: { joined: boolean; pushed: number; pulled: number; conflicts: number; backup: string | null; skipped: string[]; held?: { label: string; kinds: string[] }[]; summary: string } | null;
  commit: string | null;
  demo?: boolean;
};
