import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  createContext,
  useMemo,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Picker from "@emoji-mart/react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import "./StudyGroupModule.css";

const StudyGroupContext = createContext();

export default function StudyGroupModule({ currentUserId }) {
  return (
    <StudyGroupProvider currentUserId={currentUserId}>
      <StudyGroupUI />
    </StudyGroupProvider>
  );
}

function StudyGroupProvider({ children, currentUserId }) {
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem("study_groups");
    return saved ? JSON.parse(saved) : [];
  });

  const bcRef = useRef(null);

  useEffect(() => {
    bcRef.current = new BroadcastChannel("study_groups_channel");
    bcRef.current.onmessage = (event) => {
      if (event.data?.type === "UPDATE_GROUPS") {
        setGroups(event.data.payload);
      }
    };
    return () => bcRef.current.close();
  }, []);

  const updateGroups = useCallback(
    (newGroups) => {
      setGroups(newGroups);
      localStorage.setItem("study_groups", JSON.stringify(newGroups));
      if (bcRef.current)
        bcRef.current.postMessage({ type: "UPDATE_GROUPS", payload: newGroups });
    },
    []
  );

  const createGroup = useCallback(
    ({ subject, description }) => {
      if (!subject.trim()) return;
      const newGroup = {
        id: uuidv4(),
        subject: subject.trim(),
        description: description.trim(),
        creatorId: currentUserId,
        members: [currentUserId],
        messages: [],
      };
      updateGroups([...groups, newGroup]);
    },
    [groups, updateGroups, currentUserId]
  );

  const joinGroup = useCallback(
    (groupId) => {
      const newGroups = groups.map((g) =>
        g.id === groupId && !g.members.includes(currentUserId)
          ? { ...g, members: [...g.members, currentUserId] }
          : g
      );
      updateGroups(newGroups);
    },
    [groups, updateGroups, currentUserId]
  );

  const leaveGroup = useCallback(
    (groupId) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;
      if (group.creatorId === currentUserId) {
        alert("Group creator cannot leave the group.");
        return;
      }
      const newGroups = groups.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m !== currentUserId) }
          : g
      );
      updateGroups(newGroups);
    },
    [groups, updateGroups, currentUserId]
  );

  const sendMessage = useCallback(
    (groupId, text) => {
      if (!text.trim()) return;
      const newGroups = groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              messages: [
                ...g.messages,
                {
                  id: uuidv4(),
                  senderId: currentUserId,
                  text: text.trim(),
                  timestamp: new Date().toISOString(),
                  important: false,
                },
              ],
            }
          : g
      );
      updateGroups(newGroups);
    },
    [groups, updateGroups, currentUserId]
  );

  const toggleImportant = useCallback(
    (groupId, messageId) => {
      const newGroups = groups.map((g) => {
        if (g.id === groupId) {
          const newMessages = g.messages.map((m) => {
            if (m.id === messageId) {
              if (currentUserId === g.creatorId || currentUserId === m.senderId) {
                return { ...m, important: !m.important };
              }
            }
            return m;
          });
          return { ...g, messages: newMessages };
        }
        return g;
      });
      updateGroups(newGroups);
    },
    [groups, updateGroups, currentUserId]
  );

  return (
    <StudyGroupContext.Provider
      value={{
        groups,
        createGroup,
        joinGroup,
        leaveGroup,
        sendMessage,
        toggleImportant,
        currentUserId,
      }}
    >
      {children}
    </StudyGroupContext.Provider>
  );
}

function StudyGroupUI() {
  const {
    groups,
    createGroup,
    joinGroup,
    leaveGroup,
    sendMessage,
    toggleImportant,
    currentUserId,
  } = useContext(StudyGroupContext);

  const [selectedGroupId, setSelectedGroupId] = useState(
    groups.length > 0 ? groups[0].id : null
  );
  const [creating, setCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [toast, setToast] = useState(null);

  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  useEffect(() => {
    if (selectedGroupId && !groups.find((g) => g.id === selectedGroupId)) {
      setSelectedGroupId(null);
    }
  }, [groups, selectedGroupId]);

  const sortedMessages = useMemo(() => {
    if (!selectedGroup) return [];
    const pinned = selectedGroup.messages.filter((m) => m.important);
    const others = selectedGroup.messages.filter((m) => !m.important);
    return [...pinned, ...others].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [selectedGroup]);

  const showToast = useCallback((msg, duration = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const addEmoji = (emoji) => {
    setMessageText((text) => text + emoji.native);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const handleMessageKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (messageText.trim()) {
        sendMessage(selectedGroupId, messageText);
        setMessageText("");
        showToast("Message sent");
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        event.target !== messageInputRef.current
      ) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleLeaveGroup = () => {
    if (
      window.confirm(`Are you sure you want to leave "${selectedGroup.subject}"?`)
    ) {
      leaveGroup(selectedGroupId);
      setSelectedGroupId(null);
      showToast(`Left group "${selectedGroup.subject}"`);
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      showToast("Subject is required");
      return;
    }
    const newGroup = {
      id: uuidv4(),
      subject: newSubject.trim(),
      description: newDescription.trim(),
      creatorId: currentUserId,
      members: [currentUserId],
      messages: [],
    };
    createGroup({ subject: newSubject, description: newDescription });
    setNewSubject("");
    setNewDescription("");
    setCreating(false);
    setSelectedGroupId(newGroup.id);
    showToast(`Group "${newGroup.subject}" created`);
  };

  return (
    <div className="study-group-container">
      <aside aria-label="Study Groups">
        <header className="sg-header">
          <h2 tabIndex={0}>Study Groups</h2>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="button create-btn"
              aria-label="Create New Group"
            >
              + Create New Group
            </button>
          )}
          {creating && (
            <form
              onSubmit={handleCreateGroup}
              aria-label="Create group form"
              className="create-group-form"
            >
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                required
                className="input"
                autoFocus
                placeholder="Group subject (required)"
              />
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="input"
                rows={3}
                placeholder="Brief description (optional)"
              />
              <div className="form-actions">
                <button
                  type="submit"
                  className="button create-btn"
                  disabled={!newSubject.trim()}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="button cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </header>
        <nav
          role="list"
          tabIndex={0}
          className="group-list"
          aria-label="List of study groups"
        >
          {groups.length === 0 && (
            <p className="empty-text">No groups found. Create one above.</p>
          )}
          {groups.map((group) => {
            const isMember = group.members.includes(currentUserId);
            const isSelected = group.id === selectedGroupId;
            return (
              <div
                key={group.id}
                role="listitem"
                tabIndex={0}
                aria-selected={isSelected}
                onClick={() => setSelectedGroupId(group.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedGroupId(group.id);
                  }
                }}
                className={clsx("group-list-item", { selected: isSelected })}
              >
                <div className="group-subject">{group.subject}</div>
                <div className="group-description">{group.description}</div>
                <div className="group-members">
                  <small>{group.members.length} member(s)</small>
                  {isMember ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (group.creatorId === currentUserId) {
                          alert("Group creator cannot leave the group.");
                          return;
                        }
                        if (window.confirm(`Leave group "${group.subject}"?`)) {
                          leaveGroup(group.id);
                          if (selectedGroupId === group.id)
                            setSelectedGroupId(null);
                          showToast(`Left group "${group.subject}"`);
                        }
                      }}
                      className="button-small leave-btn"
                      aria-label={`Leave group ${group.subject}`}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        joinGroup(group.id);
                        showToast(`Joined group "${group.subject}"`);
                      }}
                      className="button-small join-btn"
                      aria-label={`Join group ${group.subject}`}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <main
        tabIndex={0}
        aria-live="polite"
        className="chat-main"
        aria-label="Group messages and chat input"
      >
        {!selectedGroup ? (
          <div className="no-selection-msg">
            <p>Select a group to view and join the discussions</p>
          </div>
        ) : (
          <>
            <header className="chat-header">
              <h3>{selectedGroup.subject}</h3>
              <p>{selectedGroup.description}</p>
            </header>

            <section className="messages" aria-label="Messages">
              {sortedMessages.length === 0 ? (
                <p className="empty-text">
                  No messages yet. Start the discussion!
                </p>
              ) : (
                sortedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={clsx("sender", { important: msg.important })}
                    tabIndex={0}
                    aria-label={`Message from ${
                      msg.senderId === currentUserId ? "You" : msg.senderId
                    }`}
                  >
                    <strong className="sender-name">
                      {msg.senderId === currentUserId ? "You" : msg.senderId}
                    </strong>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, ...props }) => (
                          <p className="message-text" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="message-text" {...props} />
                        ), // if using lists
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>

                    <small className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                    {(currentUserId === selectedGroup.creatorId ||
                      currentUserId === msg.senderId) && (
                      <button
                        className="icon-button pin-btn"
                        onClick={() => toggleImportant(selectedGroupId, msg.id)}
                        title="Pin/Unpin message"
                        aria-pressed={msg.important}
                        aria-label={
                          msg.important ? "Unpin message" : "Pin message"
                        }
                      >
                        {msg.important ? "📌" : "📍"}
                      </button>
                    )}
                  </div>
                ))
              )}
            </section>

            {selectedGroup.members.includes(currentUserId) ? (
              <form
                className="message-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (messageText.trim()) {
                    sendMessage(selectedGroupId, messageText);
                    setMessageText("");
                    showToast("Message sent");
                  }
                }}
                aria-label="Send message form"
              >
                <textarea
                  ref={messageInputRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleMessageKeyDown}
                  placeholder="Type your message here..."
                  aria-multiline="true"
                  aria-label="Message input"
                  rows={2}
                  maxLength={500}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Emoji picker"
                  aria-expanded={showEmojiPicker}
                  aria-controls="emoji-picker"
                  className="emoji-toggle-btn"
                >
                  😊
                </button>
                <button
                  type="submit"
                  className="send-btn"
                  aria-label="Send message"
                >
                  ➤
                </button>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="emoji-picker"
                    id="emoji-picker"
                    role="dialog"
                    aria-modal="true"
                  >
                    <Picker onEmojiSelect={addEmoji} />
                  </div>
                )}
              </form>
            ) : (
              <p style={{ textAlign: "center", color: "#718096" }}>
                Join this group to participate in the chat.
              </p>
            )}
          </>
        )}
      </main>

      {toast && (
        <div role="alert" aria-live="assertive" className="toast-notification">
          {toast}
        </div>
      )}
    </div>
  );
}