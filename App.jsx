import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Heart, Lock, Mic, Plus, Save, ShieldCheck, Upload, UserPlus, Users } from "lucide-react";

const STORAGE_KEY = "for-the-people-you-love-app";

function formatList(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInitialData() {
  return {
    step: 0,
    user: {
      email: "",
      password: "",
      fullName: "Steve McMASTER",
      birthday: "",
      birthplace: "",
      highSchool: "",
      currentLocation: "",
      coverPhoto: "",
      bio: "The best times in life were often the simple ones with family, laughter, and being together.",
    },
    angel: {
      name: "",
      email: "",
      relationship: "",
      doctor: "",
      lifeInsurance: "",
      vehicleInsurance: "",
      finalWishes: "",
      memberships: "",
      privateNotes: "",
      writtenMessage: "If you are hearing this, thank you for being my Angel. Please start with my most important wishes and contacts.",
      audioURL: "",
    },
    familyContacts: "",
    memories: [
      {
        id: 1,
        title: "My first memory",
        yearLabel: "Childhood",
        story: "This was one of my favorite early memories. I would want my family to remember how happy this day felt.",
        image: "",
        audioURL: "",
      },
    ],
  };
}

function usePersistentState() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getInitialData();
    try {
      return { ...getInitialData(), ...JSON.parse(saved) };
    } catch {
      return getInitialData();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  return [data, setData];
}

function Badge({ children }) {
  return <div className="badge">{children}</div>;
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Input(props) {
  return <input {...props} className={`field ${props.className || ""}`} />;
}

function Textarea(props) {
  return <textarea {...props} className={`field textarea ${props.className || ""}`} />;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button {...props} className={`btn ${variant === "secondary" ? "btn-secondary" : "btn-primary"} ${className}`}>
      {children}
    </button>
  );
}

function AudioRecorder({ value, onChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        onChange(url);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone permission is needed to record voice.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="audio-row">
      {!isRecording ? (
        <Button type="button" onClick={startRecording}><Mic size={16} /> Record</Button>
      ) : (
        <Button type="button" variant="secondary" onClick={stopRecording}>Stop</Button>
      )}
      {value ? <audio controls src={value} className="audio-player" /> : <span className="muted">No voice recording yet</span>}
    </div>
  );
}

function ImageUpload({ onLoad, label = "Upload photo" }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLoad(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <label className="upload-box">
      <Upload size={16} />
      {label}
      <input type="file" accept="image/*" hidden onChange={handleChange} />
    </label>
  );
}

function SignupStep({ data, setData }) {
  return (
    <div className="split-layout">
      <div>
        <Badge><Heart size={14} /> Welcome</Badge>
        <h1 className="hero-title">Start your life album.</h1>
        <p className="hero-copy">Build a living photo album with memories, stories, and voice recordings that your family can keep forever.</p>
      </div>
      <Card>
        <h2>Create your account</h2>
        <div className="stack">
          <Input placeholder="Email" value={data.user.email} onChange={(e) => setData((d) => ({ ...d, user: { ...d.user, email: e.target.value } }))} />
          <Input type="password" placeholder="Password" value={data.user.password} onChange={(e) => setData((d) => ({ ...d, user: { ...d.user, password: e.target.value } }))} />
          <Button onClick={() => setData((d) => ({ ...d, step: 1 }))}>Create Album</Button>
        </div>
      </Card>
    </div>
  );
}

function CoverStep({ data, setData }) {
  return (
    <div className="split-layout">
      <Card>
        <h2>Your album cover</h2>
        <div className="stack">
          <Input placeholder="Your name" value={data.user.fullName} onChange={(e) => setData((d) => ({ ...d, user: { ...d.user, fullName: e.target.value } }))} />
          <ImageUpload label="Upload cover photo" onLoad={(image) => setData((d) => ({ ...d, user: { ...d.user, coverPhoto: image } }))} />
          <div className="button-row">
            <Button variant="secondary" onClick={() => setData((d) => ({ ...d, step: 0 }))}>Back</Button>
            <Button onClick={() => setData((d) => ({ ...d, step: 2 }))}>Next</Button>
          </div>
        </div>
      </Card>
      <div className="cover-preview">
        {data.user.coverPhoto ? <img src={data.user.coverPhoto} alt="Cover" className="cover-image" /> : null}
        <div className="cover-overlay">
          <p className="cover-kicker">For the people you love</p>
          <h2>{data.user.fullName || "Your Name"}</h2>
          <p>A life album filled with memories, photos, stories, and voice.</p>
        </div>
      </div>
    </div>
  );
}

function InfoStep({ data, setData }) {
  const update = (field, value) => setData((d) => ({ ...d, user: { ...d.user, [field]: value } }));
  return (
    <Card>
      <h2>Tell your story</h2>
      <div className="grid-two">
        <Input placeholder="Birthday (optional)" value={data.user.birthday} onChange={(e) => update("birthday", e.target.value)} />
        <Input placeholder="Birthplace (optional)" value={data.user.birthplace} onChange={(e) => update("birthplace", e.target.value)} />
        <Input placeholder="High school (optional)" value={data.user.highSchool} onChange={(e) => update("highSchool", e.target.value)} />
        <Input placeholder="Where you live today (optional)" value={data.user.currentLocation} onChange={(e) => update("currentLocation", e.target.value)} />
        <div className="full-span">
          <Textarea rows={6} placeholder="Write a short introduction to your album" value={data.user.bio} onChange={(e) => update("bio", e.target.value)} />
        </div>
      </div>
      <div className="button-row top-gap">
        <Button variant="secondary" onClick={() => setData((d) => ({ ...d, step: 1 }))}>Back</Button>
        <Button onClick={() => setData((d) => ({ ...d, step: 3 }))}>Next</Button>
      </div>
    </Card>
  );
}

function MemoryStep({ data, setData }) {
  const memory = data.memories[0];
  const updateMemory = (changes) => setData((d) => ({ ...d, memories: d.memories.map((m, i) => i === 0 ? { ...m, ...changes } : m) }));

  return (
    <div className="split-layout">
      <Card>
        <h2>Add your first memory</h2>
        <div className="stack">
          <Input placeholder="Memory title" value={memory.title} onChange={(e) => updateMemory({ title: e.target.value })} />
          <Input placeholder="Year or life stage" value={memory.yearLabel} onChange={(e) => updateMemory({ yearLabel: e.target.value })} />
          <ImageUpload onLoad={(image) => updateMemory({ image })} />
          <Textarea rows={6} placeholder="Tell the story behind this photo" value={memory.story} onChange={(e) => updateMemory({ story: e.target.value })} />
          <AudioRecorder value={memory.audioURL} onChange={(audioURL) => updateMemory({ audioURL })} />
        </div>
        <div className="button-row top-gap">
          <Button variant="secondary" onClick={() => setData((d) => ({ ...d, step: 2 }))}>Back</Button>
          <Button onClick={() => setData((d) => ({ ...d, step: 4 }))}>Next</Button>
        </div>
      </Card>

      <Card>
        <h2>Preview</h2>
        <div className="memory-preview">
          {memory.image ? <img src={memory.image} alt={memory.title} className="memory-image" /> : <div className="image-placeholder">Your photo will appear here</div>}
          <p className="memory-label">{memory.yearLabel}</p>
          <h3>{memory.title}</h3>
          <p className="muted-copy">{memory.story}</p>
        </div>
      </Card>
    </div>
  );
}

function AngelStep({ data, setData }) {
  const updateAngel = (field, value) => setData((d) => ({ ...d, angel: { ...d.angel, [field]: value } }));
  return (
    <div className="split-layout">
      <Card>
        <h2>Choose your Angel</h2>
        <div className="stack">
          <Input placeholder="Angel name" value={data.angel.name} onChange={(e) => updateAngel("name", e.target.value)} />
          <Input placeholder="Angel email" value={data.angel.email} onChange={(e) => updateAngel("email", e.target.value)} />
          <Input placeholder="Relationship" value={data.angel.relationship} onChange={(e) => updateAngel("relationship", e.target.value)} />
          <Textarea rows={5} placeholder="Leave a written message for your Angel" value={data.angel.writtenMessage} onChange={(e) => updateAngel("writtenMessage", e.target.value)} />
          <AudioRecorder value={data.angel.audioURL} onChange={(audioURL) => updateAngel("audioURL", audioURL)} />
        </div>
        <div className="button-row top-gap">
          <Button variant="secondary" onClick={() => setData((d) => ({ ...d, step: 3 }))}>Back</Button>
          <Button onClick={() => setData((d) => ({ ...d, step: 5 }))}>Finish Setup</Button>
        </div>
      </Card>

      <Card>
        <h2>What your Angel can do</h2>
        <div className="stack small-gap">
          <div className="notice-box">View your private notes and final wishes.</div>
          <div className="notice-box">Hear your voice message and replay it anytime.</div>
          <div className="notice-box">Handle notifications and important next steps when needed.</div>
        </div>
      </Card>
    </div>
  );
}

function AlbumSpine({ count }) {
  const thickness = Math.max(24, Math.min(140, count * 16));
  return (
    <div className="spine-wrap">
      <div className="spine" style={{ width: thickness }} />
      <div className="spine-cover">
        <p className="cover-kicker">Legacy Album</p>
        <h3>{count} page{count === 1 ? "" : "s"}</h3>
        <p>Your album grows thicker every time memories are added.</p>
      </div>
    </div>
  );
}

function OpenAlbum({ data, setData }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [newMemory, setNewMemory] = useState({ id: 0, title: "", yearLabel: "", story: "", image: "", audioURL: "" });
  const totalPages = data.memories.length + 1;
  const currentMemory = data.memories[pageIndex - 1];
  const familyList = useMemo(() => formatList(data.familyContacts), [data.familyContacts]);

  const saveNewMemory = () => {
    if (!newMemory.title && !newMemory.story) return;
    const memory = { ...newMemory, id: Date.now() };
    setData((d) => ({ ...d, memories: [...d.memories, memory] }));
    setNewMemory({ id: 0, title: "", yearLabel: "", story: "", image: "", audioURL: "" });
    setPageIndex(totalPages);
  };

  return (
    <div className="dashboard-stack">
      <div className="dashboard-grid">
        <Card>
          <h2 className="icon-title"><BookOpen size={18} /> Your album dashboard</h2>
          <AlbumSpine count={totalPages} />
          <div className="stat-grid">
            <div className="stat-box"><strong>{data.memories.length}</strong><span>Memories</span></div>
            <div className="stat-box"><strong>{familyList.length}</strong><span>Family & Friends</span></div>
            <div className="stat-box"><strong>{data.angel.name ? 1 : 0}</strong><span>Angel</span></div>
          </div>
        </Card>

        <Card>
          <h2>Open album</h2>
          <div className="book-shell">
            <div className="book-center" />
            <div className="book-grid">
              <div className="book-page left-page">
                <p className="page-kicker">{pageIndex === 0 ? "Cover page" : `Page ${pageIndex}`}</p>
                {pageIndex === 0 ? (
                  <>
                    <h2>{data.user.fullName || "Your Album"}</h2>
                    <p className="muted-copy top-gap">{data.user.bio}</p>
                    <div className="top-gap stack small-gap">
                      {data.user.birthday ? <p><strong>Birthday:</strong> {data.user.birthday}</p> : null}
                      {data.user.birthplace ? <p><strong>Born in:</strong> {data.user.birthplace}</p> : null}
                      {data.user.highSchool ? <p><strong>High school:</strong> {data.user.highSchool}</p> : null}
                      {data.user.currentLocation ? <p><strong>Lives in:</strong> {data.user.currentLocation}</p> : null}
                    </div>
                  </>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentMemory?.id}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: "left center" }}
                    >
                      <p className="memory-label">{currentMemory?.yearLabel}</p>
                      <h2>{currentMemory?.title}</h2>
                      <p className="muted-copy top-gap">{currentMemory?.story}</p>
                      <div className="top-gap">
                        <AudioRecorder
                          value={currentMemory?.audioURL}
                          onChange={(audioURL) =>
                            setData((d) => ({
                              ...d,
                              memories: d.memories.map((m) => m.id === currentMemory.id ? { ...m, audioURL } : m),
                            }))
                          }
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              <div className="book-page right-page">
                {pageIndex === 0 ? (
                  <div className="image-placeholder large">Open your album and start turning pages.</div>
                ) : currentMemory?.image ? (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${currentMemory.id}-img`}
                      src={currentMemory.image}
                      alt={currentMemory.title}
                      className="memory-image full-height"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: "left center" }}
                    />
                  </AnimatePresence>
                ) : (
                  <div className="image-placeholder large">This memory has no photo yet.</div>
                )}
              </div>
            </div>
          </div>
          <div className="button-row top-gap">
            <Button variant="secondary" onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>Previous</Button>
            <span className="muted">Page {pageIndex + 1} of {totalPages}</span>
            <Button onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}>Next</Button>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card>
          <h2 className="icon-title"><Plus size={18} /> Add a new memory</h2>
          <div className="stack">
            <Input placeholder="Memory title" value={newMemory.title} onChange={(e) => setNewMemory((m) => ({ ...m, title: e.target.value }))} />
            <Input placeholder="Year or life stage" value={newMemory.yearLabel} onChange={(e) => setNewMemory((m) => ({ ...m, yearLabel: e.target.value }))} />
            <ImageUpload label="Upload memory photo" onLoad={(image) => setNewMemory((m) => ({ ...m, image }))} />
            <Textarea rows={5} placeholder="Tell the story behind this photo" value={newMemory.story} onChange={(e) => setNewMemory((m) => ({ ...m, story: e.target.value }))} />
            <AudioRecorder value={newMemory.audioURL} onChange={(audioURL) => setNewMemory((m) => ({ ...m, audioURL }))} />
            <Button onClick={saveNewMemory}>Save Memory</Button>
          </div>
        </Card>

        <Card>
          <h2 className="icon-title"><Users size={18} /> Family and friends</h2>
          <Textarea rows={5} placeholder="Add names or emails separated by commas" value={data.familyContacts} onChange={(e) => setData((d) => ({ ...d, familyContacts: e.target.value }))} />
          <div className="pill-wrap top-gap">
            {familyList.length ? familyList.map((item) => <span key={item} className="pill">{item}</span>) : <p className="muted">No family or friends added yet.</p>}
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card>
          <h2 className="icon-title"><ShieldCheck size={18} /> Angel section</h2>
          <div className="notice-box"><strong>{data.angel.name || "No Angel chosen yet"}</strong><br />{data.angel.relationship || "Relationship not added"}<br />{data.angel.email || "Email not added"}</div>
          <div className="stack top-gap">
            <Input placeholder="Doctor" value={data.angel.doctor} onChange={(e) => setData((d) => ({ ...d, angel: { ...d.angel, doctor: e.target.value } }))} />
            <Input placeholder="Life insurance" value={data.angel.lifeInsurance} onChange={(e) => setData((d) => ({ ...d, angel: { ...d.angel, lifeInsurance: e.target.value } }))} />
            <Input placeholder="Vehicle insurance" value={data.angel.vehicleInsurance} onChange={(e) => setData((d) => ({ ...d, angel: { ...d.angel, vehicleInsurance: e.target.value } }))} />
            <Textarea rows={4} placeholder="Burial or cremation wishes" value={data.angel.finalWishes} onChange={(e) => setData((d) => ({ ...d, angel: { ...d.angel, finalWishes: e.target.value } }))} />
            <Textarea rows={4} placeholder="Memberships or recurring payments" value={data.angel.memberships} onChange={(e) => setData((d) => ({ ...d, angel: { ...d.angel, memberships: e.target.value } }))} />
            <Textarea rows={4} placeholder="Private notes for your Angel" value={data.angel.privateNotes} onChange={(e) => setData((d) => ({ ...d, angel: { ...d.angel, privateNotes: e.target.value } }))} />
            <AudioRecorder value={data.angel.audioURL} onChange={(audioURL) => setData((d) => ({ ...d, angel: { ...d.angel, audioURL } }))} />
          </div>
        </Card>

        <Card>
          <h2 className="icon-title"><Lock size={18} /> Back of the album checklist</h2>
          <div className="stack small-gap">
            {[
              "Notify family and close friends",
              "Contact the doctor, funeral home, or care provider",
              "Locate insurance information and important documents",
              "Carry out burial or cremation wishes",
              "Notify banks, memberships, and other services",
              "Send one message to family and friends and one to professional contacts",
            ].map((item, index) => (
              <div key={item} className="notice-box"><strong>Step {index + 1}</strong><br />{item}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = usePersistentState();
  const steps = ["Sign up", "Cover", "Info", "First memory", "Choose Angel"];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">For the people you love</p>
          <p className="app-subtitle">A memory album, voice keepsake, and legacy guide</p>
        </div>
        <div className="button-row wrap-top">
          <Button variant="secondary" onClick={() => setData(getInitialData())}>Reset Demo</Button>
          <Button><Save size={16} /> Saved in browser</Button>
        </div>
      </header>

      <main className="app-main">
        {data.step < 5 ? (
          <>
            <div className="step-row">
              {steps.map((step, index) => (
                <div key={step} className={`step-pill ${data.step === index ? "active" : data.step > index ? "done" : ""}`}>
                  {index + 1}. {step}
                </div>
              ))}
            </div>

            {data.step === 0 && <SignupStep data={data} setData={setData} />}
            {data.step === 1 && <CoverStep data={data} setData={setData} />}
            {data.step === 2 && <InfoStep data={data} setData={setData} />}
            {data.step === 3 && <MemoryStep data={data} setData={setData} />}
            {data.step === 4 && <AngelStep data={data} setData={setData} />}
          </>
        ) : (
          <>
            <div className="dashboard-header">
              <div>
                <Badge><BookOpen size={14} /> Your live app</Badge>
                <h1 className="hero-title small-top">{data.user.fullName || "Your Album"}</h1>
                <p className="hero-copy">Your album is now working in the browser. You can keep adding memories, record voice notes, and build the Angel section.</p>
              </div>
              <div className="button-row wrap-top">
                <Button variant="secondary" onClick={() => setData((d) => ({ ...d, step: 0 }))}>Edit onboarding</Button>
                <Button onClick={() => setData((d) => ({
                  ...d,
                  memories: [...d.memories, {
                    id: Date.now(),
                    title: "Another beautiful memory",
                    yearLabel: "New page",
                    story: "This is a new blank memory page ready for your next story.",
                    image: "",
                    audioURL: "",
                  }],
                }))}><UserPlus size={16} /> Add blank page</Button>
              </div>
            </div>
            <OpenAlbum data={data} setData={setData} />
          </>
        )}
      </main>
    </div>
  );
}
