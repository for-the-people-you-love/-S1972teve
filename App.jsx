import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Library, LockKeyhole, ShieldCheck } from "lucide-react";

const TOTAL_PAGES = 13;
const INDEX_PAGES = [
  "Page 1 — About you: name, birthday, birthplace, parents, brothers and sisters.",
  "Page 2 — Father: one main picture in the center with a collage around him.",
  "Page 3 — Mother: one main picture in the center with a collage around her.",
  "Page 4 — Brothers and sisters: add unlimited pages for each family member.",
  "Page 5 — You: one main picture in the center with a collage around you.",
  "Page 6 — Jobs: what they were like, what you were paid when you started and when you finished, plus job photos.",
  "Page 7 — Family stories and pictures with the option to add more pages.",
  "Page 8 — Friends stories and pictures with the option to add more pages.",
  "Page 9 — Diary with unlimited writing pages.",
  "Page 10 — Contacts, notifications, who gets the book, and who is an Angel.",
  "Page 11 — Important information your Angel needs to know.",
  "Page 12 — Angel message page for family, friends, and professionals."
];

const initialState = {
  subtitle: "",
  authorLine: "",
  password: "",
  fullName: "",
  birthday: "",
  birthplace: "",
  fatherName: "",
  motherName: "",
  siblings: "",
  fatherStory: "",
  motherStory: "",
  familyMemberName: "",
  familyMemberRelationship: "",
  familyMemberStory: "",
  yourStory: "",
  jobTitle: "",
  jobYears: "",
  jobStartPay: "",
  jobEndPay: "",
  jobStory: "",
  familyStoryTitle: "",
  familyStoryText: "",
  friendStoryTitle: "",
  friendStoryText: "",
  diaryEntryTitle: "",
  diaryEntryText: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  isRecipient: false,
  isAngel: false,
};

function Field(props) {
  return <input {...props} className={`field ${props.className || ""}`} />;
}
function Area(props) {
  return <textarea {...props} className={`field textarea ${props.className || ""}`} />;
}

function CoverBook({ subtitle, authorLine, onOpen, staticMode = false }) {
  return (
    <motion.button
      type="button"
      initial={{ rotateX: 16, rotateY: -18, scale: 0.95 }}
      animate={{ rotateX: 16, rotateY: -18, scale: 1 }}
      whileHover={staticMode ? {} : { y: -8, scale: 1.02 }}
      transition={{ duration: 0.45 }}
      onClick={onOpen}
      className={`book-cover ${staticMode ? "static-book" : ""}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="book-spine-cover" />
      <div className="gold-frame" />
      <div className="top-band" />
      <div className="bottom-band" />
      <div className="book-cover-inner">
        <div className="cover-seal" />
        <h1 className="cover-title">For You When I'm Gone</h1>
        <p className="cover-subtitle">
          {subtitle || "Everything I wanted you to remember, know, and take care of."}
        </p>
        <p className="cover-author">{authorLine || "written by..."}</p>
      </div>
      {!staticMode ? <div className="tap-note">Tap to open</div> : null}
    </motion.button>
  );
}

function SecurePrompt({ secureInput, setSecureInput, unlockProtected, useFingerprint }) {
  return (
    <div className="secure-box">
      <p className="eyebrow secure-title">
        <LockKeyhole size={14} /> Secure access required
      </p>
      <p className="muted">
        Pages 10, 11, and 12 are protected. Use your password or fingerprint to continue.
      </p>
      <Field type="password" value={secureInput} onChange={(e) => setSecureInput(e.target.value)} placeholder="Enter password" />
      <div className="secure-actions">
        <button onClick={unlockProtected} className="primary-btn">Unlock with password</button>
        <button onClick={useFingerprint} className="secondary-btn">Use fingerprint</button>
      </div>
    </div>
  );
}

function PhotoStoryPage({ title, intro, subjectLabel, storyLabel, storyValue, onStoryChange }) {
  return (
    <>
      <h2 className="page-title">{title}</h2>
      <p className="page-copy">{intro}</p>
      <div className="card-block">
        <div className="photo-layout">
          <div className="collage-col">
            <div className="photo-box">Collage photo</div>
            <div className="photo-box">Collage photo</div>
            <div className="photo-box">Collage photo</div>
          </div>
          <div className="main-photo-wrap">
            <div className="main-photo-box">Main center photo of {subjectLabel}</div>
          </div>
          <div className="collage-col">
            <div className="photo-box">Collage photo</div>
            <div className="photo-box">Collage photo</div>
            <div className="photo-box">Collage photo</div>
          </div>
        </div>
      </div>
      <div className="card-block">
        <p className="mini-heading">{storyLabel}</p>
        <Area rows={8} value={storyValue} onChange={onStoryChange} placeholder={`Write about ${subjectLabel}, the memories you have, what made ${subjectLabel} special, and anything you want remembered.`} />
      </div>
    </>
  );
}

function AboutPage({ state, setState }) {
  return (
    <>
      <h2 className="page-title">Page 1 — About You</h2>
      <p className="page-copy">This page lets you enter the important information about yourself and your family roots.</p>
      <div className="card-block">
        <div className="grid-two">
          <Field placeholder="Full name" value={state.fullName} onChange={(e) => setState((s) => ({ ...s, fullName: e.target.value }))} />
          <Field placeholder="Birthday" value={state.birthday} onChange={(e) => setState((s) => ({ ...s, birthday: e.target.value }))} />
          <Field placeholder="Where you were born" value={state.birthplace} onChange={(e) => setState((s) => ({ ...s, birthplace: e.target.value }))} />
          <Field placeholder="Father's name" value={state.fatherName} onChange={(e) => setState((s) => ({ ...s, fatherName: e.target.value }))} />
          <Field placeholder="Mother's name" value={state.motherName} onChange={(e) => setState((s) => ({ ...s, motherName: e.target.value }))} />
          <Area rows={5} placeholder="Brothers and sisters" value={state.siblings} onChange={(e) => setState((s) => ({ ...s, siblings: e.target.value }))} className="span-2" />
        </div>
      </div>
    </>
  );
}

function FamilyMemberPage({ state, setState }) {
  return (
    <>
      <h2 className="page-title">Page 4 — Brothers and Sisters</h2>
      <p className="page-copy">This page lets you start a family member page for each brother or sister. You can keep adding as many pages as needed so everyone in the family has their place in the book.</p>
      <div className="card-block">
        <div className="grid-two">
          <Field placeholder="Brother or sister name" value={state.familyMemberName} onChange={(e) => setState((s) => ({ ...s, familyMemberName: e.target.value }))} />
          <Field placeholder="Relationship (brother / sister)" value={state.familyMemberRelationship} onChange={(e) => setState((s) => ({ ...s, familyMemberRelationship: e.target.value }))} />
        </div>
        <div className="single-main-photo"><div className="main-photo-box short">Main center photo for this family member</div></div>
        <div className="three-up"><div className="photo-box">Collage photo</div><div className="photo-box">Collage photo</div><div className="photo-box">Collage photo</div></div>
      </div>
      <div className="card-block">
        <p className="mini-heading">About this family member</p>
        <Area rows={8} value={state.familyMemberStory} onChange={(e) => setState((s) => ({ ...s, familyMemberStory: e.target.value }))} placeholder="Write about your brother or sister, your memories together, what made them special, and anything you want future generations to know." />
        <div className="action-row"><button className="primary-btn">Save this family page</button><button className="secondary-btn">Add another family page</button></div>
      </div>
    </>
  );
}

function JobsPage({ state, setState }) {
  return (
    <>
      <h2 className="page-title">Page 6 — Jobs</h2>
      <p className="page-copy">Add the jobs you’ve had, what they were like, what you were paid when you started and finished, and the years you worked. Include photos from your work as well.</p>
      <div className="card-block">
        <div className="grid-two">
          <Field placeholder="Job title" value={state.jobTitle} onChange={(e) => setState((s) => ({ ...s, jobTitle: e.target.value }))} />
          <Field placeholder="Years worked (e.g. 2005–2015)" value={state.jobYears} onChange={(e) => setState((s) => ({ ...s, jobYears: e.target.value }))} />
          <Field placeholder="Starting pay" value={state.jobStartPay} onChange={(e) => setState((s) => ({ ...s, jobStartPay: e.target.value }))} />
          <Field placeholder="Ending pay" value={state.jobEndPay} onChange={(e) => setState((s) => ({ ...s, jobEndPay: e.target.value }))} />
        </div>
        <div className="single-main-photo"><div className="main-photo-box short">Main photo from this job</div></div>
        <div className="three-up"><div className="photo-box">Work photo</div><div className="photo-box">Work photo</div><div className="photo-box">Work photo</div></div>
      </div>
      <div className="card-block">
        <p className="mini-heading">About this job</p>
        <Area rows={8} value={state.jobStory} onChange={(e) => setState((s) => ({ ...s, jobStory: e.target.value }))} placeholder="Write what this job was like, what you learned, the people you worked with, and how it impacted your life." />
        <div className="action-row"><button className="primary-btn">Save this job</button><button className="secondary-btn">Add another job</button></div>
      </div>
    </>
  );
}

function StoryCollectionPage({ title, intro, itemLabel, titleValue, textValue, onTitleChange, onTextChange }) {
  return (
    <>
      <h2 className="page-title">{title}</h2>
      <p className="page-copy">{intro}</p>
      <div className="card-block">
        <Field placeholder="Title of this memory" value={titleValue} onChange={onTitleChange} />
        <div className="single-main-photo"><div className="main-photo-box short">Main photo for this memory</div></div>
        <div className="three-up"><div className="photo-box">{itemLabel}</div><div className="photo-box">{itemLabel}</div><div className="photo-box">{itemLabel}</div></div>
      </div>
      <div className="card-block">
        <p className="mini-heading">The story behind this moment</p>
        <Area rows={8} value={textValue} onChange={onTextChange} placeholder="Tell the story behind this moment. Who was there? What happened? Why is it important?" />
        <div className="action-row"><button className="primary-btn">Save this memory</button><button className="secondary-btn">Add another memory page</button></div>
      </div>
    </>
  );
}

function DiaryPage({ state, setState }) {
  return (
    <>
      <h2 className="page-title">Page 9 — Diary</h2>
      <p className="page-copy">This is your personal diary. You can write anything here — your thoughts, feelings, memories, or moments in time. There are no rules.</p>
      <div className="card-block">
        <Field placeholder="Title or date (optional)" value={state.diaryEntryTitle} onChange={(e) => setState((s) => ({ ...s, diaryEntryTitle: e.target.value }))} />
        <Area rows={14} value={state.diaryEntryText} onChange={(e) => setState((s) => ({ ...s, diaryEntryText: e.target.value }))} placeholder="Write whatever you want here... your thoughts, your day, your memories, or anything you want to leave behind." className="top-gap" />
      </div>
      <div className="card-block"><div className="action-row"><button className="primary-btn">Save this entry</button><button className="secondary-btn">Add another diary page</button></div></div>
    </>
  );
}

function ContactsPage({ state, setState }) {
  return (
    <>
      <h2 className="page-title">Page 10 — Contacts & Angel</h2>
      <p className="page-copy">Add the people in your life who should be notified. Choose who receives your book and who will be your Angel.</p>
      <div className="card-block">
        <div className="grid-two">
          <Field placeholder="Full name" value={state.contactName} onChange={(e) => setState((s) => ({ ...s, contactName: e.target.value }))} />
          <Field placeholder="Email address" value={state.contactEmail} onChange={(e) => setState((s) => ({ ...s, contactEmail: e.target.value }))} />
          <Field placeholder="Phone number" value={state.contactPhone} onChange={(e) => setState((s) => ({ ...s, contactPhone: e.target.value }))} />
        </div>
        <div className="check-row">
          <label><input type="checkbox" checked={state.isRecipient} onChange={(e) => setState((s) => ({ ...s, isRecipient: e.target.checked }))} /> Send them this book</label>
          <label><input type="checkbox" checked={state.isAngel} onChange={(e) => setState((s) => ({ ...s, isAngel: e.target.checked }))} /> Make this person an Angel</label>
        </div>
      </div>
      <div className="card-block"><div className="action-row"><button className="primary-btn">Save contact</button><button className="secondary-btn">Add another contact</button></div></div>
    </>
  );
}

function AngelInfoPage() {
  return (
    <>
      <h2 className="page-title">Page 11 — For Your Angel</h2>
      <p className="page-copy">This section is for important information your Angel will need when you pass away. Keep it clear and up to date.</p>
      <div className="card-block">
        <div className="grid-two">
          <Field placeholder="Life insurance company" />
          <Field placeholder="Policy number" />
          <Field placeholder="Vehicle insurance" />
          <Field placeholder="Doctor / clinic" />
          <Field placeholder="Lawyer / will location" className="span-2" />
        </div>
        <div className="radio-row">
          <label><input type="radio" name="burial" /> Burial</label>
          <label><input type="radio" name="burial" /> Cremation</label>
        </div>
        <p className="mini-heading">Memberships to cancel</p>
        <Area rows={4} placeholder="List any memberships or subscriptions that need to be cancelled." />
        <p className="mini-heading top-gap">Important instructions</p>
        <Area rows={6} placeholder="Remind your Angel to contact insurance companies and request their checklist of what needs to be done when someone passes away. Add anything else they should know." />
      </div>
      <div className="card-block"><button className="primary-btn">Save this information</button></div>
    </>
  );
}

function AngelMessagePage() {
  return (
    <>
      <h2 className="page-title">Page 12 — Angel Message</h2>
      <p className="page-copy">This page is for your Angel. After you pass, they can write a message about you and send it to your family and friends.</p>
      <div className="card-block">
        <Field placeholder="Your Angel's name" />
        <p className="mini-heading top-gap">Message to family and friends</p>
        <Area rows={10} placeholder="Write a message about their life, who they were, what they meant to people, and anything you want everyone to know." />
        <p className="mini-heading top-gap">Message for professionals (optional)</p>
        <Area rows={6} placeholder="Separate message for doctors, insurance companies, or other professionals if needed." />
      </div>
      <div className="card-block"><div className="action-row"><button className="primary-btn">Send message to family & friends</button><button className="secondary-btn">Send message to professionals</button></div></div>
    </>
  );
}

function renderPageContent(pageNumber, state, setState) {
  switch (pageNumber) {
    case 1: return <><h2 className="page-title">Index</h2><div className="index-list">{INDEX_PAGES.map((item) => <div key={item} className="index-item">{item}</div>)}</div></>;
    case 2: return <AboutPage state={state} setState={setState} />;
    case 3: return <PhotoStoryPage title="Page 2 — Father" intro="Add one main photo of your father in the center, a collage of pictures around him, and a story about who he was." subjectLabel="your father" storyLabel="About your father" storyValue={state.fatherStory} onStoryChange={(e) => setState((s) => ({ ...s, fatherStory: e.target.value }))} />;
    case 4: return <PhotoStoryPage title="Page 3 — Mother" intro="Add one main photo of your mother in the center, a collage of pictures around her, and a story about who she was." subjectLabel="your mother" storyLabel="About your mother" storyValue={state.motherStory} onStoryChange={(e) => setState((s) => ({ ...s, motherStory: e.target.value }))} />;
    case 5: return <FamilyMemberPage state={state} setState={setState} />;
    case 6: return <PhotoStoryPage title="Page 5 — You" intro="This page is for you. Add one main photo in the center, a collage of pictures around you, and write your own story in your own words." subjectLabel="you" storyLabel="Your story" storyValue={state.yourStory} onStoryChange={(e) => setState((s) => ({ ...s, yourStory: e.target.value }))} />;
    case 7: return <JobsPage state={state} setState={setState} />;
    case 8: return <StoryCollectionPage title="Page 7 — Family Stories" intro="This is where you start adding moments with your family. Add photos and tell the story behind them. You can keep adding new pages for more memories." itemLabel="Memory photo" titleValue={state.familyStoryTitle} textValue={state.familyStoryText} onTitleChange={(e) => setState((s) => ({ ...s, familyStoryTitle: e.target.value }))} onTextChange={(e) => setState((s) => ({ ...s, familyStoryText: e.target.value }))} />;
    case 9: return <StoryCollectionPage title="Page 8 — Friends" intro="This is where you add memories with your friends. These are the moments, laughs, and stories that shaped your life." itemLabel="Friend photo" titleValue={state.friendStoryTitle} textValue={state.friendStoryText} onTitleChange={(e) => setState((s) => ({ ...s, friendStoryTitle: e.target.value }))} onTextChange={(e) => setState((s) => ({ ...s, friendStoryText: e.target.value }))} />;
    case 10: return <DiaryPage state={state} setState={setState} />;
    case 11: return <ContactsPage state={state} setState={setState} />;
    case 12: return <AngelInfoPage />;
    case 13: return <AngelMessagePage />;
    default: return <AngelMessagePage />;
  }
}

export default function App() {
  const [stage, setStage] = useState("cover");
  const [state, setState] = useState(initialState);
  const [pageNumber, setPageNumber] = useState(1);
  const [secureInput, setSecureInput] = useState("");
  const [showProtectedPrompt, setShowProtectedPrompt] = useState(false);
  const [unlockedProtectedPages, setUnlockedProtectedPages] = useState(false);

  const collageCards = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, rotate: [-9, -5, -2, 2, 5, 8][i % 6], top: 4 + (i % 4) * 22, left: 3 + (i % 3) * 31, width: 22 + (i % 2) * 3, height: 18 + (i % 3) * 2,
  })), []);

  const protectedPages = [11, 12, 13];
  const canGoBack = pageNumber > 1;
  const canGoForward = pageNumber < TOTAL_PAGES;

  const tryGoToPage = (target) => {
    if (protectedPages.includes(target) && !unlockedProtectedPages) {
      setShowProtectedPrompt(true);
      return;
    }
    setShowProtectedPrompt(false);
    setPageNumber(target);
  };

  const unlockProtected = () => {
    if (secureInput === state.password && state.password) {
      setUnlockedProtectedPages(true);
      setShowProtectedPrompt(false);
      setPageNumber(11);
    }
  };

  const useFingerprint = () => {
    setUnlockedProtectedPages(true);
    setShowProtectedPrompt(false);
    setPageNumber(11);
  };

  return (
    <div className="app-shell">
      <div className="memory-collage" aria-hidden="true">
        {collageCards.map((card) => <div key={card.id} className="memory-card" style={{ top: `${card.top}%`, left: `${card.left}%`, width: `${card.width}%`, height: `${card.height}%`, transform: `rotate(${card.rotate}deg)` }} />)}
      </div>

      <header className="top-bar">
        <div><p className="eyebrow">For You When I'm Gone</p><h1>New clean package</h1></div>
        <div className="header-pills"><span className="pill"><BookOpen size={14} /> My Book</span><span className="pill"><Library size={14} /> My Library</span></div>
      </header>

      <main className="main-wrap">
        <AnimatePresence mode="wait">
          {stage === "cover" && (
            <motion.section key="cover" className="center-stage" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
              <CoverBook subtitle={state.subtitle} authorLine={state.authorLine} onOpen={() => setStage("password")} />
            </motion.section>
          )}

          {stage === "password" && (
            <motion.section key="password" className="password-layout" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
              <div className="book-col"><CoverBook subtitle={state.subtitle} authorLine={state.authorLine} onOpen={() => {}} staticMode /></div>
              <div className="password-card">
                <p className="eyebrow">Protected book</p>
                <h2>Create your password</h2>
                <p className="muted">Before opening the book, create the password that protects your private pages. You can also set your cover subtitle and written-by line here.</p>
                <div className="field-stack">
                  <Field placeholder="Optional subtitle" value={state.subtitle} onChange={(e) => setState((s) => ({ ...s, subtitle: e.target.value }))} />
                  <Field placeholder="Optional written by line" value={state.authorLine} onChange={(e) => setState((s) => ({ ...s, authorLine: e.target.value }))} />
                  <Field type="password" placeholder="Create password" value={state.password} onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))} />
                </div>
                <button className="primary-btn" onClick={() => state.password.trim() && setStage("reader")}>Open Book</button>
              </div>
            </motion.section>
          )}

          {stage === "reader" && (
            <motion.section key="reader" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="reader-top">
                <div className="reader-note"><ShieldCheck size={16} /><span>Pages 10, 11, and 12 require password or fingerprint.</span></div>
                <div className="reader-note"><Library size={16} /><span>Library system placeholder included for future received books.</span></div>
              </div>
              <div className="book-open">
                <div className="book-spine-open" />
                <div className="open-grid">
                  <section className="left-page">
                    <p className="page-kicker">Back of previous page</p>
                    <div className="blank-back" />
                    <button type="button" className={`corner-arrow left ${canGoBack ? "" : "disabled"}`} onClick={() => canGoBack && tryGoToPage(pageNumber - 1)} aria-label="Go back one page">←</button>
                  </section>
                  <section className="right-page">
                    <AnimatePresence mode="wait">
                      <motion.div key={pageNumber} initial={{ rotateY: 60, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -60, opacity: 0 }} transition={{ duration: 0.35 }} style={{ transformOrigin: "left center" }} className="page-content-wrap">
                        <p className="page-kicker">Page {pageNumber}</p>
                        {renderPageContent(pageNumber, state, setState)}
                      </motion.div>
                    </AnimatePresence>
                    {showProtectedPrompt && <SecurePrompt secureInput={secureInput} setSecureInput={setSecureInput} unlockProtected={unlockProtected} useFingerprint={useFingerprint} />}
                    <button type="button" className={`corner-arrow right ${canGoForward ? "" : "disabled"}`} onClick={() => canGoForward && tryGoToPage(pageNumber + 1)} aria-label="Go forward one page">→</button>
                  </section>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
