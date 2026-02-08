export interface CommunitySamplePost {
  id: string
  user: string
  title: string
  content: string
  image: string
}

export const communitySamplePosts: CommunitySamplePost[] = [
  {
    id: "sample-1",
    user: "Ishani",
    title: "Tree plantation drive 🌱",
    content:
      "Joined the ReGen community for a plantation drive at Baradari Garden. We planted 50 saplings today! Every tree counts. Who's joining next weekend?",
    image: "/signin-forest.png",
  },
  {
    id: "sample-2",
    user: "Arjun",
    title: "Clean-up at the canal",
    content:
      "Organized a small clean-up near Sector 12. Collected 3 bags of plastic. The canal looks a bit better. Let's keep this going — next Sunday same spot!",
    image: "/abc.jpg",
  },
  {
    id: "sample-3",
    user: "Priya",
    title: "Composting in our colony",
    content:
      "Started a composting pit with my neighbours. Kitchen waste is now turning into soil instead of methane in landfills. Easy win for the planet.",
    image: "/abc.jpg",
  },
  {
    id: "sample-4",
    user: "ReGen Community",
    title: "Cleanliness Drive this Saturday",
    content:
      "Join our Cleanliness Drive at Baradari Garden! We'll remove plastic waste and plant saplings. Bring gloves and water. Together we can make Patiala greener.",
    image: "/signin-forest.png",
  },
]
