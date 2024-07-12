import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.ensemble import VotingClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle

# Load the dataset
df = pd.read_csv('spam.csv')

df.columns = ['Label', 'Text']

df['Text_Length'] = df['Text'].apply(len)
df['Num_Links'] = df['Text'].apply(lambda x: len(re.findall(r'http[s]?://', x)))

tfidf = TfidfVectorizer(stop_words='english')
X_tfidf = tfidf.fit_transform(df['Text'])

X = np.hstack((X_tfidf.toarray(), df[['Text_Length', 'Num_Links']].values))

y = df['Label'].apply(lambda x: 1 if x == 'spam' else 0)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

nb_classifier = MultinomialNB()
svm_classifier = SVC(kernel='linear', probability=True)

ensemble_classifier = VotingClassifier(estimators=[
    ('nb', nb_classifier),
    ('svm', svm_classifier)
], voting='soft')

ensemble_classifier.fit(X_train, y_train)

y_pred = ensemble_classifier.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')
print(classification_report(y_test, y_pred))

with open('spam_classifier.pkl', 'wb') as f:
    pickle.dump(ensemble_classifier, f)
with open('tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf, f)
