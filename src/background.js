// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.insertCSS(null, {file: "guides.css"});
  chrome.tabs.executeScript(null, {file: "draggabilly.js"});
  chrome.tabs.executeScript(null, {file: "guides.js"});
});