"use client";

import { useState } from "react";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const animalName = "キツネタイプ";
  const animalEmoji = "🦊";
  const description =
    "あなたは知的で観察力が高く、冷静に物事を分析できるタイプです。";
  const confidence = 92;
  const analysisResults = [
    "論理的思考が強い",
    "慎重で計画的",
    "状況判断能力が高い",
  ];

  const handleShare = async () => {
    if (!selectedImage) {
      alert("画像を選択してください");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    formData.append(
      "payload",
      JSON.stringify({
        embeds: [
          {
            title: `${animalEmoji} ${animalName}`,
            description,
            color: 0x5865f2,
            fields: [
              {
                name: "診断確度",
                value: `${confidence}%`,
                inline: true,
              },
              {
                name: "AI分析結果",
                value: analysisResults.join("\n"),
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      })
    );

    formData.append("image", selectedImage);

    await fetch("/api/discord", {
      method: "POST",
      body: formData,
    });

    setIsLoading(false);
    alert("Discordに送信しました");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-3xl border border-gray-700">

        <div className="text-center mb-8">
          <div className="text-7xl">{animalEmoji}</div>
          <h1 className="text-3xl font-bold mt-2">{animalName}</h1>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400">
            <span>診断確度</span>
            <span>{confidence}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full mt-2">
            <div
              className="h-3 bg-indigo-500 rounded-full"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <p className="text-gray-400 mb-6">{description}</p>

        <div className="space-y-2 mb-8">
          {analysisResults.map((item, i) => (
            <div key={i} className="bg-gray-800 p-3 rounded-xl">
              • {item}
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 rounded-xl"
          />
        )}

        <button
          onClick={handleShare}
          disabled={isLoading}
          className="mt-6 w-full bg-indigo-500 py-3 rounded-xl"
        >
          {isLoading ? "送信中..." : "結果をDiscordに送信"}
        </button>
      </div>
    </main>
  );
}
