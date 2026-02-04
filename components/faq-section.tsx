import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I find a peer counselor?",
    answer:
      "It's simple. Create a profile, tell us a bit about what you're going through, and our matching algorithm will connect you with a peer who has shared experiences.",
  },
  {
    question: "Is it anonymous?",
    answer:
      "Yes, completely. You can choose to remain anonymous in your chats. Your privacy and safety are our top priorities.",
  },
  {
    question: "Who are the peer counselors?",
    answer:
      "Peer counselors are fellow students who have been verified and trained in active listening and supportive communication. They are not therapists, but they are there to listen and support.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes, ASU4U is 100% free for students. We believe mental health support should be accessible to everyone, regardless of their financial situation.",
  },
  {
    question: "What if I need professional help?",
    answer:
      "If you need professional support or are in crisis, we provide immediate resources and can help connect you with university counseling services or crisis hotlines.",
  },
  {
    question: "Can I become a peer counselor?",
    answer:
      "Absolutely! If you want to support others, you can apply to become a peer counselor. We provide full training and support for our volunteers.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-32 px-6 pb-80">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Frequently asked questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Homie. Have a question not listed? Contact our support.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 py-0 my-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-foreground/30"
            >
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
