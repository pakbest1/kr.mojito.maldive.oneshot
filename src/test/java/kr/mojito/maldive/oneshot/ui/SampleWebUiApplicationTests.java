/*
 * Copyright 2012-2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package kr.mojito.maldive.oneshot.ui;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.net.URI;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import kr.mojito.maldive.oneshot._bootstrap.MojitoApplication;

/**
 * Basic integration tests for demo application.
 *
 * @author Dave Syer
 */
/*
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SampleWebUiApplication.class)
@WebAppConfiguration
@IntegrationTest("server.port:0")
@DirtiesContext
 */
// junit5
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = MojitoApplication.class)
@WebAppConfiguration
@Tag("IntegrationTest")
@DirtiesContext
public class SampleWebUiApplicationTests {

	@Value("${server.port}")
	private int port;

	@Test
	public void testHome() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("http://localhost:" + this.port, String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
//		assertTrue("Wrong body (title doesn't match):\n" + entity.getBody(), entity
//				.getBody().contains("<title>Messages"));
//		assertFalse("Wrong body (found layout:fragment):\n" + entity.getBody(), entity
//				.getBody().contains("layout:fragment"));
	}

	@Test
	public void testCss() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("http://localhost:" + this.port + "/css/bootstrap.min.css", String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
//		assertTrue("Wrong body:\n" + entity.getBody(), entity.getBody().contains("body"));
	}

	@Test
	public void testIco() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("http://localhost:" + this.port + "/favicon.ico", String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
//		assertTrue("Wrong body:\n" + entity.getBody(), entity.getBody().contains("body"));
	}


	@Test
	public void tcReqList() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("http://localhost:" + this.port +"/list", String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
	}

	@Test
	public void tcReqForm() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("http://localhost:" + this.port +"?form", String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
	}



	@Test
	public void testCreate() throws Exception {
		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.set("text", "FOO text");
		map.set("summary", "FOO");
		URI location = new TestRestTemplate().postForLocation("http://localhost:" + this.port, map);
//		assertTrue("Wrong location:\n" + location,
//				location.toString().contains("localhost:" + this.port));
		assertEquals("http://localhost:80", location.toString().contains("localhost:" + this.port));
	}

	@Test
	public void tcReqId() throws Exception {
		ResponseEntity<String> entity = new TestRestTemplate().getForEntity("http://localhost:" + this.port +"/1", String.class);
		assertEquals(HttpStatus.OK, entity.getStatusCode());
	}
}
