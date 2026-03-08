import { Heart, Users, Shield, Sparkles } from "lucide-react";
import heroCommunity from "@/assets/hero-community.jpg";

const values = [
  { icon: Heart, title: "Inclusion First", desc: "We believe everyone deserves love and connection, regardless of ability." },
  { icon: Users, title: "Community Driven", desc: "Built with input from disability advocates and community leaders." },
  { icon: Shield, title: "Safety & Trust", desc: "Trained moderators and robust safety tools protect our community." },
  { icon: Sparkles, title: "Innovation", desc: "AI-powered matching that understands accessibility needs and lifestyle alignment." },
];

const AboutPage = () => (
  <div className="min-h-screen">
    <section className="bg-gradient-hero py-20">
      <div className="container text-center max-w-3xl">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold">About <span className="text-gradient-primary">TogetherAble</span></h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          TogetherAble is redefining the dating experience for individuals with disabilities 
          and creating an inclusive environment for all users.
        </p>
      </div>
    </section>

    <section className="py-20">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-warm">
          <img src={heroCommunity} alt="TogetherAble community" className="w-full h-auto" />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-bold">Our Mission</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We started TogetherAble because we saw a gap in the dating world. People with 
            disabilities deserve platforms that understand their unique needs — from accessible 
            interfaces to intelligent matching that considers communication styles, support needs, 
            and lifestyle compatibility.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our team includes disability advocates, accessibility experts, and technologists 
            committed to building the most inclusive dating experience possible.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20 bg-gradient-hero">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-card rounded-2xl p-6 shadow-card text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
