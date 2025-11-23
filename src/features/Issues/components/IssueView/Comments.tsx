import { Button } from '@/components/ui/button';
import { UserProject } from '@/features/Navigation/Model/project.model';
import { getMentionsId } from '@/utility/objectUtils';
import React, { FC, useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { issueService } from '../../service/issue.service';
import { MessageSquare, Pencil, Reply, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Comment } from '../../interface/issue.interfcae';

type props = {
    issueId: string;
    data: UserProject[] | null;
    comments: Comment[];
    refetch: () => void;
};

function parseMentions(text: string) {
    const regex = /@\[(.+?)\]\((.+?)\)/g;
    const elements: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    text.replace(regex, (match, name, id, offset) => {
        if (offset > lastIndex) {
            elements.push(text.slice(lastIndex, offset));
        }
        elements.push(
            <span
                key={id}
                className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors"
            >
                {name}
            </span>
        );
        lastIndex = offset + match.length;
        return match;
    });

    if (lastIndex < text.length) {
        elements.push(text.slice(lastIndex));
    }
    return elements;
}

const Comments: FC<props> = ({ issueId, data, comments, refetch }) => {
    // ---------------- STATE ----------------
    const [commentText, setCommentText] = useState('');
    const [editCommentText, setEditCommentText] = useState('');
    const [commentEditId, setCommentEditId] = useState('');
    const [replyToId, setReplyToId] = useState('');
    const [replyText, setReplyText] = useState('');

    const transformedData =
        data?.map((e) => ({
            id: e.userId,
            display: `${e.first_name} ${e.last_name}`,
        })) ?? [];

    // ---------------- GROUPING ----------------
    const groupComments = (comments: Comment[]) => {
        const parents = comments.filter((c) => !c.parent_comment_id);
        const repliesByParent: Record<string, Comment[]> = {};

        comments.forEach((c) => {
            if (c.parent_comment_id) {
                if (!repliesByParent[c.parent_comment_id]) repliesByParent[c.parent_comment_id] = [];
                repliesByParent[c.parent_comment_id].push(c);
            }
        });

        return { parents, repliesByParent };
    };

    const { parents, repliesByParent } = groupComments(comments);

    // ---------------- HANDLERS ----------------

    const resetAllStates = () => {
        setCommentEditId('');
        setEditCommentText('');
        setReplyToId('');
        setReplyText('');
    };

    const handleCommentSave = async () => {
        const content = commentEditId ? editCommentText : commentText;
        const ids = getMentionsId(content);

        const body: Comment = {
            issue_id: issueId,
            mentions: ids,
            content,
        };

        if (commentEditId) {
            body.id = commentEditId;

            const original = comments.find((c) => c.id === commentEditId);
            if (original?.parent_comment_id) {
                body.parent_comment_id = original.parent_comment_id;
            }
        }

        await issueService.saveComment(body);
        await refetch();
        resetAllStates();
    };

    const handleReplySave = async () => {
        if (!replyToId) return;

        const ids = getMentionsId(replyText);

        const body: Comment = {
            issue_id: issueId,
            content: replyText,
            mentions: ids,
            parent_comment_id: replyToId,
        };

        await issueService.saveComment(body);
        await refetch();

        resetAllStates();
    };

    const deleteComment = async (id: string) => {
        await issueService.deleteComment(id);
        await refetch();
        resetAllStates();
    };

    // ---------------- MENTIONS STYLES ----------------
const mentionsStyle = {
  control: {
    backgroundColor: "white",
    border: "1px solid #d1d5db", // Gray border
    borderRadius: 6,
    padding: "0px",
    minHeight:  70,
    fontSize: 14,
  },
  highlighter: {
    padding: "10px 12px",
    minHeight: 40,
    whiteSpace: "pre-wrap",
  },
  input: {
    padding: "10px 12px",
    minHeight: 40,
    outline: "none",
    border: "none",
    fontSize: 14,
  },
  suggestions: {
    list: {
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      overflow: "hidden",
      maxHeight: 200,
      zIndex: 100,
    },
    item: {
      padding: "8px 12px",
      cursor: "pointer",
      borderRadius: 6,
    },
  },
};
const replyCommentStyles = {...mentionsStyle, control:{
    backgroundColor: "white",
    minHeight:  10,
  }}


    // ---------------- UI ----------------
    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* NEW COMMENT */}
            <div className="mb-6">
                <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>You</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <MentionsInput
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white"
                            style={mentionsStyle}
                        >
                            <Mention
                                trigger="@"
                                data={transformedData}
                                displayTransform={(id, display) => `@${display}`}
                            />
                        </MentionsInput>

                        <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={handleCommentSave}>
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setCommentText('')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMMENT THREAD */}
            <div className="space-y-10 max-h-[350px] overflow-y-scroll">
                {parents.map((comment) => {
                    const isEditing = commentEditId === comment.id;
                    const isReplying = replyToId === comment.id;
                    const replies = repliesByParent[comment.id] || [];

                    return (
                        <div key={comment.id} className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[21px] top-10 bottom-0 w-px bg-gray-300"></div>

                            {/* PARENT COMMENT */}
                            <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                        {comment.author.first_name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-gray-900">
                                            {comment.author.first_name}{' '}
                                            {comment.author.last_name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {comment.timestamp}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    {!isEditing && (
                                        <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                                            {parseMentions(comment.content)}
                                        </div>
                                    )}

                                    {/* Edit Mode */}
                                    {isEditing && (
                                        <div className="mt-3">
                                            <MentionsInput
                                                value={editCommentText}
                                                onChange={(e) =>
                                                    setEditCommentText(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-md border border-gray-300 bg-white"
                                                style={mentionsStyle}
                                            >
                                                <Mention
                                                    trigger="@"
                                                    data={transformedData}
                                                    displayTransform={(id, d) =>
                                                        `@${d}`
                                                    }
                                                />
                                            </MentionsInput>

                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    size="sm"
                                                    onClick={
                                                        handleCommentSave
                                                    }
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={resetAllStates}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {!isEditing && (
                                        <div className="flex items-center gap-4 text-gray-500 mt-2">
                                            <button
                                                onClick={() => {
                                                    setReplyToId(comment.id);
                                                    setCommentEditId('');
                                                }}
                                                className="hover:text-blue-600 text-sm"
                                            >
                                                <Reply size={15} />
                                            </button>

                                            <button
                                                className="hover:text-blue-600 text-sm"
                                                onClick={() => {
                                                    setCommentEditId(
                                                        comment.id
                                                    );
                                                    setEditCommentText(
                                                        comment.content
                                                    );
                                                    setReplyToId('');
                                                }}
                                            >
                                                <Pencil size={15} />
                                            </button>

                                            <button
                                                className="hover:text-red-600 text-sm"
                                                onClick={() =>
                                                    deleteComment(comment.id!)
                                                }
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Reply Box */}
                                    {isReplying && (
                                        <div className="mt-3">
                                            <MentionsInput
                                                value={replyText}
                                                onChange={(e) =>
                                                    setReplyText(e.target.value)
                                                }
                                                className="w-full rounded-md border border-gray-300 bg-white"
                                                style={replyCommentStyles}
                                            >
                                                <Mention
                                                    trigger="@"
                                                    data={transformedData}
                                                    displayTransform={(id, d) =>
                                                        `@${d}`
                                                    }
                                                />
                                            </MentionsInput>

                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    size="sm"
                                                    onClick={
                                                        handleReplySave
                                                    }
                                                >
                                                    Reply
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={resetAllStates}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* REPLIES */}
                                    {replies.map((r) => (
                                        <div
                                            key={r.id}
                                            className="mt-6 flex gap-3 relative"
                                        >
                                            {/* Elbow Line */}
                                            <div className="absolute left-[-21px] top-3 w-5 h-[1px] bg-gray-300"></div>

                                            <Avatar className="w-7 h-7">
                                                <AvatarFallback>
                                                    {r.author.first_name[0]}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">
                                                        {r.author.first_name}{' '}
                                                        {r.author.last_name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {r.timestamp}
                                                    </span>
                                                </div>

                                                {/* Reply body */}
                                                {commentEditId !== r.id && (
                                                    <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                                                        {parseMentions(
                                                            r.content
                                                        )}
                                                    </div>
                                                )}

                                                {/* Reply edit mode */}
                                                {commentEditId === r.id && (
                                                    <div className="mt-3">
                                                        <MentionsInput
                                                            value={
                                                                editCommentText
                                                            }
                                                            onChange={(e) =>
                                                                setEditCommentText(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full rounded-md border border-gray-300 bg-white"
                                                            style={mentionsStyle}
                                                        >
                                                            <Mention
                                                                trigger="@"
                                                                data={
                                                                    transformedData
                                                                }
                                                                displayTransform={(
                                                                    id,
                                                                    d
                                                                ) => `@${d}`}
                                                            />
                                                        </MentionsInput>

                                                        <div className="flex gap-2 mt-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={
                                                                    handleCommentSave
                                                                }
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={
                                                                    resetAllStates
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Reply actions */}
                                                {commentEditId !== r.id && (
                                                    <div className="flex items-center gap-4 text-gray-500 mt-2">
                                                        <button
                                                            className="hover:text-blue-600 text-sm"
                                                            onClick={() => {
                                                                setReplyToId(
                                                                    comment.id
                                                                );
                                                                setCommentEditId(
                                                                    ''
                                                                );
                                                            }}
                                                        >
                                                            <Reply size={15} />
                                                        </button>

                                                        <button
                                                            className="hover:text-blue-600 text-sm"
                                                            onClick={() => {
                                                                setCommentEditId(
                                                                    r.id
                                                                );
                                                                setEditCommentText(
                                                                    r.content
                                                                );
                                                                setReplyToId(
                                                                    ''
                                                                );
                                                            }}
                                                        >
                                                            <Pencil size={15} />
                                                        </button>

                                                        <button
                                                            className="hover:text-red-600 text-sm"
                                                            onClick={() =>
                                                                deleteComment(
                                                                    r.id!
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Comments;
