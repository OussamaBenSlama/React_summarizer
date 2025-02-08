"use client";

import { Brain, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const articles = [
  {
    title:
      "Mahfel Allègua: Ethnobotanique de la tradition de la Allègua du Sud tunisien",
    description: `La « Allaga » est une tradition très ancienne répandue en Tunisie et plusparticulièrement dans le sud tunisien. La « Allaga » est un couffin contenant des
articles, essentiellement de beauté, qu’offre au cours des festivités du mariage le
mari à sa future femme.`,
    url: "http://react.org.tn/mahfel-allegua-ethnobotanique-de-la-tradition-de-la-allegua-du-sud-tunisien/",
  },
  {
    title: "Researchers’ Night in Tunisia",
    description:
      "Le Ministère de l’Enseignement Supérieur et de la Recherche Scientifique informe la tenue de la 1ère Edition Nuit des Chercheurs en Tunisie et ce le vendredi 28 septembre 2018 à la Cité de la Culture de 15h00 à Minuit.",
    url: "http://react.org.tn/researchers-night-in-tunisia/",
  },
  {
    title: "Recrutement d’un(e) assistant(e) de projet auprès de REACT",
    description:
      "Dans le cadre du projet « GREEN NIGHT », l’Association Tunisienne de Développement Durable, La Recherche en Action (REACT) lance un appel à candidature pour le recrutement d’un(e) assistant(e) projet.",
    url: "http://react.org.tn/recrutement-dune-assistante-de-projet-aupres-de-react/",
  },
];

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<
    (typeof articles)[0] | null
  >(null);
  const [summary, setSummary] = useState(null);

  const handleSummarize = (article: (typeof articles)[0]) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("url", article.url);

    axios
      .post("http://127.0.0.1:5000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This is important for form-data
        },
      })
      .then((response) => {
        console.log("Success:", response.data);
        setSummary(response.data.summarized_text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Featured Articles
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{article.description}</p>
                </CardContent>
                <CardFooter className="flex gap-3 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Read More
                  </Button>
                  <Button
                    className="flex-1 flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleSummarize(article)}
                  >
                    <Brain className="h-4 w-4" />
                    Summarize
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed">
                {summary && (
                  <>
                    <h2>
                      {
                        (summary as string)
                          .split("**Title:**")[1]
                          .split("**Summary:**")[0]
                      }
                    </h2>
                    <br />
                    <>
                      {
                        (summary as string)
                          .split("**Title:**")[1]
                          .split("**Summary:**")[1]
                          .split("**Conclusion:**")[0]
                      }
                    </>
                    <br />
                    <>
                      {
                        (summary as string)
                          .split("**Title:**")[1]
                          .split("**Summary:**")[1]
                          .split("**Conclusion:**")[1]
                      }
                    </>
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
