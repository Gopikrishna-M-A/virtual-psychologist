'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const SMMSEResultDisplay = () => {
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('SMMSEResult');
    if (storedData) {
      setResultData(JSON.parse(storedData));
    }
  }, []);

  if (!resultData) {
    return <div>No results found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SMMSE Result</h1>
      {resultData.map((section, index) => {
        const sectionName = Object.keys(section)[0];
        const sectionData = section[sectionName];
        return (
          <Card key={index} className="mb-4">
            <CardHeader className="bg-gray-100 font-semibold">{sectionName}</CardHeader>
            <CardContent>
              {sectionData.map((answer, answerIndex) => (
                <div key={answerIndex} className="mb-2">
                  <span className="font-medium">Question {answerIndex + 1}: </span>
                  <span>{answer !== null ? answer : 'Not answered'}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SMMSEResultDisplay;