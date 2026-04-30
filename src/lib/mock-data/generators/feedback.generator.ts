import type { CitizenFeedback, Ticket } from "@/types";
import { randomInt, randomElement } from "@/lib/utils/seeded-random";

const FEEDBACK_COMMENTS = [
  { en: "Issue resolved quickly. Thank you!", hi: "समस्या जल्दी हल हो गई। धन्यवाद!" },
  { en: "Good work by the team.", hi: "टीम ने अच्छा काम किया।" },
  { en: "Took some time but resolved well.", hi: "थोड़ा समय लगा लेकिन अच्छे से हल हुआ।" },
  { en: "Satisfactory resolution.", hi: "संतोषजनक समाधान।" },
  { en: "Could have been faster.", hi: "तेज़ी से हो सकता था।" },
  { en: "Average experience.", hi: "सामान्य अनुभव।" },
  { en: "Excellent service!", hi: "उत्कृष्ट सेवा!" },
  { en: "Not fully resolved. Needs follow-up.", hi: "पूरी तरह हल नहीं हुआ। फॉलो-अप चाहिए।" },
];

export function generateFeedback(tickets: Ticket[]): Map<string, CitizenFeedback> {
  const feedbackMap = new Map<string, CitizenFeedback>();

  const resolvedTickets = tickets.filter(t => t.status === "resolved" || t.status === "closed");
  for (const ticket of resolvedTickets) {
    const comment = randomElement(FEEDBACK_COMMENTS);
    const rating = randomElement([3, 4, 4, 4, 5, 5, 5, 3, 2, 5]) as 1 | 2 | 3 | 4 | 5;
    feedbackMap.set(ticket.id, {
      ticketId: ticket.id,
      rating,
      comment: comment.en,
      commentHi: comment.hi,
      submittedAt: ticket.resolvedAt || ticket.updatedAt,
    });
  }

  return feedbackMap;
}
