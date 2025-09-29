/*
 * Copyright 2022-2024 Amazon.com, Inc. or its affiliates. All rights reserved.
 *
 * AMAZON PROPRIETARY/CONFIDENTIAL
 *
 * You may not use this file except in compliance with the terms and
 * conditions set forth in the accompanying LICENSE.TXT file.
 *
 * THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY
 * DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS,
 * IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
 */

class Document {
  createElement = (name: string) => {
    console.log(`document.createElement ${name}`);
    // @ts-ignore
    return global.gmedia;
  };
  getElementsByTagName = (name: string) => {
    console.log(`document.getElementsByTagName ${name}`);
    // @ts-ignore
    return global.gmedia;
  };
  static install() {
    console.log('Installing Document polyfill');
    // @ts-ignore
    global.document = new Document();
  }
}

export default Document;
